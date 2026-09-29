---
name: game-park
description: Lessons learned from shipping board game adaptations on the Game Park framework (rules-api / react-game 7.8). Covers how to split the work with the developer, model the rules, lay out the table, design buttons and animations, write headers, help and tutorial texts, prepare images, and reproduce players' bugs. Use it for any work in a Game Park game repository: setup, rules, material, locators, headers, help dialogs, tutorial, AI, logs, scoring, translations, assets, or a bug report.
---

# Game Park: lessons from shipped games

This skill adds to the project `CLAUDE.md` and the official documentation (`../gamepark.github.io/docs`, or
the raw GitHub URLs listed in `CLAUDE.md`). It does not repeat them. Read the doc page for the API, and read
this skill for the decisions the doc does not make.

Load only the reference you need for the task:

| Task | Reference |
|------|-----------|
| Modelling material and locations, rules, memory, reactions, tests, AI | `references/rules.md` |
| Table layout, locators, buttons, drag and drop, animations, panels, logs, scoring | `references/front.md` |
| Headers, help dialogs, tutorial, translations, typography | `references/texts.md` |
| Images, icons, rulebook PDFs, sounds (material shadows: `scripts/shadow.py`) | `references/assets.md` |
| Putting the developer in a given state, bug reports, deploys | `references/debugging.md` |

Every Game Park game is open source on `github.com/gamepark/<name>`, and is often cloned next to the
project in `../<name>`. When the developer says "like in ../X", read how X does it before you write
anything. If `../X` is missing, clone it or read it on GitHub. Recent games (framework 7.8) that follow
these practices:

- **greylune**: the full front end, with one player shown at a time, waypoints, logs and scoring.
- **leda**: hidden information, the tutorial, and replay compatibility.
- **aurealis**: the tutorial, icons in help dialogs, and `MaterialMoney`.
- **odysseus**, **chateau-combo**, **captain-flip**, **faraway**, **skyrift**, **mythologies**, **zenith**.

## The order that works

1. Rename the template. Copy the rulebooks to `app/public/rules-fr.pdf` / `rules-en.pdf`, optimised for the
   web. The rulebooks are the authority for everything that follows.
2. Prepare the images (`references/assets.md`).
3. Write the setup, `Material.ts` and the locators, but **only to display the initial state**. Get the
   table layout approved before you write a single rule.
4. Propose the `RuleId` enum for review. Once approved, implement all the rules in one go, with unit tests
   and random full-game simulations.
5. Headers, then buttons and UX phase by phase, then help dialogs and the theme.
6. Tutorial AI, tutorial, logs, final scoring, `giveTime`, sounds, and finally translations.

The rules converge quickly. The front end takes many small, precise rounds of feedback: apply each one
exactly as asked, and never reopen a value the developer tuned by hand ("don't touch it anymore, it's
perfect").

## Working with the developer

- **Propose, then implement.** When the developer says they will review (an enum, the `RuleId`s, the
  tutorial texts), deliver that piece and stop.
- **The rulebook decides, and its ambiguities are the developer's call.** The printed cards win over the
  appendix, and the FAQ or errata win over both. Put every question and discrepancy in a file meant for the
  publisher: the differences, the questions and the current choices, with no technical detail. Once a
  question is settled, write the decision in a comment next to the code that implements it, so nobody
  "fixes" it back.
- **Try the one-line fix first.** Look at what the simple option produces before you call it impossible.
  Reading a library's source gives you a hypothesis, not a result: a throwaway test in that library proves
  it in a minute.
- **The rules are the game, not the show.** Never add a move, a memory entry or a rule step only so the
  app can display something. It is a lie in the game log and in replays. If the display needs something
  the framework lacks, `../react-game` gets the fix, and only with the developer's approval.
- **Leave the developer's environment alone.** Their `yarn dev` runs on port 3000 and their game lives in
  that origin's `localStorage`. Reuse the server if it is running. Otherwise start yours on another port
  (`--port 3100 --strictPort`), and kill orphaned `node` processes before you finish. Never overwrite a
  game state they asked you to keep.
- **Format like the neighbouring code.** Never run prettier on a glob: some repos keep fluent `Material`
  chains on one line, and prettier rewrites files you never touched.
- **When the developer wants to test something**, set up the state that shows it (`references/debugging.md`).

## Measure the page, don't photograph it (Claude in Chrome)

A screenshot costs about 1600 tokens and is resubmitted on every later turn. For any question of position,
distance, size or state, use `javascript_tool` with `getBoundingClientRect()`, `game.view` or
`game.legalMoves`: you get exact numbers for a few dozen tokens. Save screenshots for what is truly visual
(how an effect renders, legibility, an animation). Run one verification pass for N changes, and shrink the
window before any capture.

## Non-negotiables

- The header decides what to show from the active player (`rules.getActivePlayer()`, or
  `rules.activePlayers` in a simultaneous phase), **never from the legal moves**, which are filtered in the
  tutorial and change during animations. Buttons may use legal moves.
- Every `RuleId` has a header. A console `Missing header for rule id N` is a bug.
- Discarded or boxed items are deleted (`deleteItem`), unless the game needs a visible discard pile.
- Below version 1.0.0, clear code beats stable enum values. From 1.0.0 on, append new values only, **and**
  keep every memory write replay-compatible (`references/rules.md`).
- Anything that can be computed from the state or the action history is computed, not memorised: turn
  counter, scores, logs.
