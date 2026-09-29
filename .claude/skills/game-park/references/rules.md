# Rules: modelling and implementation

See the docs first: `concepts/items-and-locations.md`, `features/location-strategies.md`,
`features/item-moves.md`, `features/memory.md`, `concepts/consequences.md`, `tips/design-item-ids.md`.

## Locations

- **`location.id` for a named slot, `x`/`y` for positions.** A board zone, a season or a distance is an
  `id` (an enum such as `Area.Village = 0, Area.Wand…`), not an `x`. Keep `x`/`y` for positions that a
  location strategy manages.
- **Never compute `x` by hand in the setup.** Create the items and let the location strategy number them.
  Pick the simplest strategy that works: none when the `id` already identifies the slot,
  `PositiveSequenceStrategy` for a plain sequence, `StackingStrategy` only when there really is a second
  dimension, and `FillGapStrategy` when an item's place must not depend on how many items are left (a
  token used must not make the others slide).
- **Half coordinates for in-between places.** `{ x: 0, y: 0.5 }` is the gap between cells (0,0) and (0,1).
  It is simpler than a separate "gap side" model.
- **The top of a pile stays in the pile.** An event that is active but still visually on top of its pile
  is the top item of `EventPile` with `rotation: true`. It does not get an `ActiveEvent` location. Adapt the
  hiding strategy to match.
- **Only put a property on a location when it carries information.** Add `rotation` only if the item can
  show that face there. Add `player` only if the location belongs to a player (not on a shared score track
  or a shared camp).
- An item sitting on a card uses `parent` (the card index). Without it, the item is drawn under the pile.
- Read card names for enum members from the English rulebook.

## Moves: prefer real material over custom moves

Each time a custom move was written, the developer asked the same question: "can't this simply be moving
the item?"

- Using an item means rotating it, not a `CustomMove`.
- Choosing between two skills means moving that skill's marker, not `ChooseSkill` with a boolean.
- Changing season means moving the season pawn. Taking a bonus means deleting the bonus token.
- Gains that only move a marker or create an item do not need a `GainX` custom move.
- **Money is the exception, when it uses `MaterialMoney`** (coins of several values). Gaining or paying
  an amount is then a `CustomMove` (for example `GainGold` with the amount). Its consequences are the
  coin moves that `MaterialMoney` computes, including giving change. Without `MaterialMoney`, a plain
  item move is enough.
- Keep `CustomMove` for pure choices with no material (such as picking an option of a card), and give its
  data explicit types (enums, not booleans or sentinels like `BUY = -1`).
- Use `moveItem` when exactly one item exists (`moveItems` on a unique token reads as a bug).
- Batch with `moveItemsAtOnce`, `deleteItemsAtOnce` and `createItemsAtOnce` (recalling all villagers,
  clearing a row). Sort the selection before `moveItemsAtOnce` so the items land in the same display order.
- Skip a useless shuffle, such as a deck of one card.
- Use the type guards (`isMoveItemType(...)`, `isCustomMoveType(...)`), never `'location' in move`.

## Consequences and sequencing

- **Order the consequences the way a person at the table would do them, left to right.** Animations play
  in that order, so the player sees it. Resolve each completed card fully (remove its tokens, gain its
  bonus, flip it) before you move on to the next one, not "flip everything, then gain everything".
- **Trigger from the move that causes it.** Start the next player's turn in `afterItemMove` of the
  first-player token move. Reveal the next event when the previous one is deleted. Deal the missing cards
  when the reshuffle happens. This is simpler than precomputing everything in one place.
- The reshuffle pattern: deal what is available. If something is still missing, move the discard pile into
  the deck with `moveItemsAtOnce`, then shuffle, and in `afterItemMove` of the shuffle, deal the rest. If
  both piles are empty, throw an error: that is a state the game cannot continue from.
- **Unpredictable moves.** The server knows everything, so it can put new cards directly where they
  belong. What matters is to declare `isUnpredictableMove` for a rule start whose outcome the client cannot
  compute (for example, a new year that deals hidden cards).
- **An immediate win ends the game immediately.** Stop the consequences once the game is over. Do not let
  the rest of the phase resolve.
- Compute the next rule after the move when that removes special cases.

## Player agency

- **Split a decision into steps.** First choose what to do (resolve this encounter, activate this card),
  then choose how (what to spend, which reward). Leave the card where it is until the choice is complete.
- **Never offer a strictly dominated option**, and never let a player refuse a reward that is automatically
  earned. Resolve automatically when there is only one sensible outcome and it is the maximum one. When the
  player only gets part of the reward, require a click, so that they notice.
- **"Pass" only when the rulebook allows it.** If the player must act, offer pass only when no other move
  exists, and explain why ("You can resolve neither an encounter nor a quest here").
- **An end-of-turn step.** Do not end the turn automatically after the last action. Add a rule where the
  player can only confirm ("[End my turn]", auto after about 10 s), so they can still undo.
- **Reactions** (effects the rulebook presents as reactions) go through one generic `ReactionRule` window,
  opened before the action they react to. The action resumes afterwards. Do not mix reaction moves into
  another rule's choices to save a click: in one game this hid a bug where a card could not react to half
  of its triggers. Offer a reaction only when it changes something (not if the extra cost is zero, and
  only when that resource is actually spent). If the action is only possible thanks to a reaction, the
  window forbids passing.
- `giveTime()` per rule: 30 to 45 s for the main decision of a turn, and about 10 s when a player takes
  over in the middle of someone else's turn.

## Memory

- Forget every memory entry as soon as it stops being useful. Clear queues (such as `NextRules`) at every
  phase boundary, not only when they are consumed.
- Do not create a second variable when an existing one already answers the question. Recompute what the
  state or history gives you (the last year = an empty deck; the turn number = the action history).
- Game options are in `game.options` since rules-api 7.8. Do not copy them into memory.
- **Replay compatibility (1.0.0 and later).** After a deploy, the server rebuilds each ongoing game the
  next time it loads, by replaying its recorded actions with the **new** code. The recorded consequences
  are replayed, but everything the handlers write to memory runs with the new code. A handler that now
  writes something the old consequences never consume corrupts the game for good. Before you change what a
  handler memorises, work out how a game started on the previous version replays. To check real games,
  replay each one from `setup` in vitest and compare the result with its stored `state`.

## Code review points the developer raised repeatedly

- Names follow the rulebook's concepts. Give one name and one type to structures that are the same thing
  (for example an `Effect` shared by a card and an ability). Optional fields should be optional for the
  same reasons (`requirements?` and `gains?`).
- No dead code: remove `getPlayerMoves() { return [] }` (it is the default) and unused rules or locations.
  Merge what is duplicated between the setup and a round-reset rule.
- Before 1.0.0, put a new `RuleId` or `Memory` value where it belongs, not at the end.

## Tests

- Vitest in `rules/`. Write unit tests for every tricky rule, and a regression test for every bug fixed.
- **Random full-game simulation** (see `greylune/rules/src/GreyluneGame.spec.ts`): play games with a seeded
  random choice of legal move, from setup to the end, for every player count. After each move, check the
  invariants: there is always a legal move, the material count is conserved, and every item is in a
  location where it can be. It catches crashes that unit tests miss.
- To test a hidden-information game, compare `getView`/`getMoveView` with the result of applying the moves.
  The console error "the view is not the same when moveViews are applied" points at a hiding strategy or
  at memory that differs between client and server.

## Tutorial AI

See `features/tutorial-ai.md`. What worked:

- The developer states heuristics in plain words. Implement them **literally** (such as "never move a pawn
  backwards; always advance the pawn closest to the first incomplete card") instead of inventing a scoring.
- Forbid dumb strategies in general, not case by case (covering your own cards, ending a phase with idle
  workers, choosing an unusable option).
- Aim for synergies and a resource balance (gold above a threshold is worth little).
- Tune it on the states the developer points to ("the game in my localStorage on 3000"), and never destroy
  those states.
