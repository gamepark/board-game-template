# Debugging: states, bug reports, deploys

See the docs first: `features/console-commands.md`, `troubleshooting/*`.

## Putting the developer in a given state

The local game is stored in `localStorage` under the `game` prop of `GameProvider` (for example
`greylune`), as `{ players, setup, state, actions, playerId, monkeyOpponents, tutorial }`.

- To start from a patched state: write it to `state` **and** `setup`, empty `actions`, then call
  `location.reload()`.
- **Remove an item with `quantity: 0`**, the way `deleteItem` does. Never park it at `x: 99` in a deck: a
  `DeckLocator` stacks by `x` and draws the card face down somewhere on the table, and the developer will
  take it for a bug. Also delete the items whose `parent` was that item.
- Before you hand over, check with JS that no remaining item has an absurd `x`, and that the decks are
  contiguous.
- A large JSON does not fit in a console call. Put it in `app/public/`, `fetch` it from the page, and delete
  it afterwards.
- A state in the middle of the tutorial: play the script in vitest (`wrapRulesWithTutorial` + `playAction`,
  with `server.deps.inline: [/@gamepark/]` and a `window`/`document`/`screen` stub), then dump the object.
- To play exactly what a button plays: the redux store is not exposed (`window.game.store` is a snapshot).
  Walk the React fibers from `#root` to the node whose `memoizedProps.store` has `dispatch`, and dispatch
  `{ type: 'playMove', payload: { move } }`.

## Bug reports and saved games

The developer passes you files such as `bug-report-<id>.json` or `game-<id>.json` (with `setup`, `actions`
and `state`).

- Replay the `actions` from `setup` in vitest, stop at the reported moment, and compare with `state`. When
  asked, rebuild that moment in the local app.
- **Check whether the player is mistaken before you "fix" anything.** Several reports were a misread rule
  or an effect the player did not notice.
- If the stored `state` does not match a replay on the current code, suspect a deploy in between (see
  replay compatibility in `references/rules.md`). Get the old sources with `git archive <tag> rules/src`, and
  find the affected games by replaying each one with the old code, then the new one.

## Production

- **Texts missing in production** (players see raw keys like `header.choose-action.you`): read
  `Last-Modified` on the deployed `translation/*.json` first. It dates the deploy, not the commit. A deploy
  that sets no `Cache-Control` lets browsers keep an old empty dictionary for hours.
- **Safari-only bug**: Playwright WebKit on Windows has no `window.AudioContext`, and the app crashes on it.
  Stub it with `page.addInitScript` before `goto`, or every run is a false positive. Wait 60 s, because
  i18next retries failed namespaces with backoff.
- Before `yarn deploy`, make sure `yarn build` passes (TypeScript errors, and imports that react-game no
  longer exports).
