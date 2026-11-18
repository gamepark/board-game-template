# Bot: building, measuring and improving an automatic player

See the doc first for the API: `features/tutorial-ai.md`. This page is what building the bots of **greylune**
and **panorama** taught us. Read their `rules/src/ai/` before you start: the arena can be copied almost as is.

| | greylune | panorama |
|---|---|---|
| Game | long turns, chains of decisions, little direct interaction | one tile per turn, race for the turn order, hidden stacks |
| Search | the bot's own turn, on copies of the real rules | 5 best turns, 4 samples each, opponents played until the bot's next turn |
| Simulator | `rules.play` on a JSON copy (about 0.5 ms per move) | a light immutable model of the table (`State.ts`, `Model.ts`) |
| Human data | 144 games exported from the platform | 3 games played by the developer |

## Size the work first

Four questions tell how hard the bot will be:

1. **Is the score a good evaluation of a position?** If so, current score plus a small potential is enough.
2. **How much do players interact?** Parallel solitaire needs no model of the opponent. A duel does.
3. **How many moves, how deep?** Group the decisions of a turn when they multiply.
4. **Is there hidden information or simultaneous play?** Plain search does not handle it: sample what is hidden.

Near-solitaire games need a few dozen lines (dekal, expedition). Do not build an arena for them.

## Architecture that worked

- **One entry point**, `<Game>AI: GameAI`, exported from `rules/src/index.ts` and passed as `ai={…}` to
  `GameProvider` in `app/src/main.tsx`. Keep a synchronous `chooseMove` (or `rankMoves`) next to it for tests,
  the arena and the audit.
- **Evaluate in victory points**: a forecast of the final score. Every weight then has a meaning and can be
  checked against real games. Put all values on **one scale**: greylune priced this year's journeys and future
  journeys differently, and refused to buy its best cards.
- **Search little, evaluate well.** On greylune, searching the turn is worth +19.8 ±3.1 points over one-move
  greedy. On panorama, the short search is worth +7 to +11, but 16 candidates or 2 turns ahead brought nothing.
- **Use the real rules until they are too slow.** Write a dedicated model only when you must simulate opponents
  and sample hidden items, and then **test it against the rules** over random full games (`Model.spec.ts`).
- **Stop the simulation at the edge of what the player can know**: before a deal of hidden cards, before the
  final count (the evaluation already counts it), and at the end of the turn. Catch a move that cannot be played
  out and score it `-Infinity`.
- **Prune before searching**: identical moves (two equal workers on the same spot) and strictly dominated ones.
- **Break ties on purpose.** Without a tie-break, the bot takes whichever move the rules list first.
- **Keep every behaviour behind a setting** (`searchSettings`, `evaluationSettings`, `Params`). The arena can then
  pit the old behaviour against the new one without keeping a copy of the code.
- **A hard rule beats a weight when a sure gain competes with an uncertain one.** A known gain now tends to win
  against a larger but uncertain one later. Still measure the rule: see "Trust measures" below.
- **Model what drives the game**, even when it is not points. Panorama's turn order is a race: modelling it won
  87 % of games against the version that ignored it.

### Hidden information

The framework gives the bot the **full game state** (`rules.game`), not the player's view. Not cheating is
entirely up to the bot:

- Read only what the player can see, and draw hidden items among the items nobody has seen.
- **Test it**: deal the hidden items again among themselves and assert that the decision does not change
  (`never reads the tiles nobody can see` in `PanoramaAI.spec.ts`).
- Seed the sampling from a hash of the visible state, so the same position always gets the same move.

### Playing like a person

- Play the moves in the order of a player at the table. Panorama's bot moves its balloon, then lays the tile, by
  returning both moves. Each must be legal once the previous one is played. This works in the local client. It has
  not been verified on the platform server.
- Keep a decision under about 1 s at the highest player count, or move the bot to a worker: it blocks the UI.
- Implement the developer's heuristics **literally** ("never move a pawn backwards; always advance the pawn closest
  to the first incomplete card") rather than inventing a scoring for them.
- Forbid dumb strategies in general, not case by case (covering your own cards, ending a phase with idle workers,
  choosing an unusable option).
- Aim for synergies and a resource balance: each coin is worth less than the one before.
- Tune the bot on the states the developer points to ("the game in my localStorage on 3000"), and never destroy them.

## The arena: measure, never guess

`rules/src/ai/arena/` plus `rules/scripts/arena.mjs` (`yarn arena`). Keep Node imports in the script only, because
`src/` is compiled into the published package. Add `/rules/arena-results/` to `.gitignore`.

- **Paired games**: deal each table from a seed (`withSeed` replaces `Math.random` during the setup) and play it
  once per rotation of the seats. Comparing on the same deals removes most of the luck.
- **Report a gap with its 95 % interval.** A gap whose interval includes 0 is not a result. On greylune, 90 paired
  games still give ±3.5 points, and detecting 2 points takes about 300 games. A tuning "measured" on 48 games was noise.
- **Contenders**: `random` (the floor), `greedy` (one move deep), `bot`, the bot with one setting changed, and the
  previous version. Panorama parses settings from the command line: `bot:duel=0.8`.
- **Behaviour metrics**, per game: what the score cannot explain (idle workers, cards bought, moves by kind, zones
  closed). They turn "it seems to leave too early" into a number.
- **Calibrate the forecast**: record what the evaluation predicts each turn and compare with the final result
  (`--calibrate`). On panorama, this cut the early-game error from 30 to 13 points.
- **Limit the workers.** 15 parallel processes ran out of memory on 3 and 4 player games: lower `--workers` for those.
- Delete frozen copies of old versions before committing.

## Trust measures, and know what they cannot see

- **Test each hypothesis before fixing it.** Most of ours were wrong:
  - Greylune's rule against leaving Spring early had no measurable effect (+0.7 ±3.5).
  - Good greylune players do not own more Villagers (5.0 against 4.9). They use their Objects more (10 against 6.2 per game).
  - On panorama, leaving fewer gaps in the stacks made the bot **worse** (36 % of wins instead of 50 %).
- **Bot against bot has a blind spot.** Identical bots make the same mistakes, which cancel out. Panorama's bot gave
  up objectives worth 30 points against a human, and the arena showed nothing. A change that is neutral in the arena can
  still be right: judge it on human games.
- **Self-play does not punish what nobody at the table does.** Add contenders with an extreme style.

## Learn from human games

**The developer's games come first**, and a few are enough:

1. Ask the developer to play against the bot, and how they play. Their tips become measurable: "never cut a promising
   zone" gave a `cut` weight, which reduced closed zones from 0.4 per turn to 1 in 19 tiles.
2. Save each game as a fixture **before the next one starts**: a new game overwrites `localStorage`.
3. Replay it and compare every move with the bot's choice.
4. For a weight the arena cannot judge, keep the **smallest value that fixes the observed mistake** and check that it
   costs nothing in the arena. Too much hurts: `cut` at 2.5 clearly lost.

**Platform exports, when they exist**, are the strongest lever. Greylune went from 66 points (the average human) to
73, +6.9 ±2.5 head to head at 2 players, with two fixes that came straight from them:

1. **Replay** each finished game without a player who quit, and keep only those reaching the recorded scores (99 of
   114). The others were played under older rules.
2. **Compare by level**: file the human seats by score (below 70, 70-84, 85+) and read the same metrics as the bots.
3. **Audit**: at each turn of the strong players, rank their move among the bot's (43 % agreement on greylune). Read
   the largest value gaps first. The biggest one exposed a bug: each journey of the year counted the same Encounter
   (+3.9 ±2.3 once fixed).
4. **Replace guessed constants with measured ones**, then tune in the arena: the value of a journey was half of what
   the games showed. 80 % of the measure gained +3.7 ±2.7, and 100 % only +2.0 ±2.7.

Measure at every player count: greylune's gains are only confirmed at 2 players.

## Tests

- Whole games against itself at every player count, ending without error.
- Beats `random`, or `greedy` by a margin, on a few fixed seeds.
- Never reads hidden information.
- **Every mistake found becomes a frozen position** with an assertion ("does not leave Spring with more Villagers in
  hand than the rest of its year can use", `fixtures/early-summer.json`). These tests prevent regressions. Only the
  arena measures strength.

## Difficulty levels (not built yet)

No game has levels yet, so this is the plan rather than experience. Do not weaken a strong bot with random blunders:
it plays brilliant moves, then absurd ones. Hide what a beginner does not see (final count, long-term combos, the
opponents), and choose among the moves close to the best with a weighted draw.
