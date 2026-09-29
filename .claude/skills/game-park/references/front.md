# Front end: table, interaction, animations

See the docs first: `step-by-step-example/place-items.md` and `organize-the-table.md`,
`features/lists-of-items.md`, `piles-of-items.md`, `hand-of-cards.md`, `display-a-location.md`,
`buttons-on-items.md`, `configure-the-animations.md`, `final-scoring.md`, `moves-history.md`,
`troubleshooting/*`.

## Table layout

- **Display the initial state for the maximum player count first**, with everyone in reading direction (no
  rotated opponents). At lower counts, leave the unused seats empty at first, and make the most of the
  space afterwards (at 2 players, spread the two boards so each gets the same headroom).
- **Choose how the players' areas are shown, per game.** There are three usual strategies:
  - **Everything visible**: duel games (aurealis, bloody-grove), or games with little material per player
    (mythologies).
  - **Everything visible, but uneven** beyond a player count: the selected player is shown large, or the
    other players are shown partially (captain-flip, ipso, odysseus).
  - **One player shown at a time**, selected by clicking their panel (greylune, chateau-combo). Hidden
    players' animations then need waypoints (see below), and the panel needs an obvious "eye"
    affordance, drawn as part of the panel.

  Pick the first strategy that keeps the items large enough, and ask the developer when in doubt.
- **The table must be as small as possible.** The smaller the table, the larger each item is on screen,
  and the game must stay playable on a phone. Every empty band costs size on every item. Set
  `xMin`/`xMax`/`yMin`/`yMax` so the outermost items touch the edge with a 1 to 2 mm margin. Pack the
  material tightly: look for layouts that take the least width, and plan space for how much a player's area
  can grow over the game. Do not plan space for things that never happen.
- **One layout module.** Put the anchor points in a shared file (`locators/TableLayout.ts`), named after
  what they are, and derive the other positions from them. Do not scatter magic numbers across the locators.
- **The marks printed on the board decide.** Place a slot where its printed notch or mark is, and write in
  a comment which mark it is.
- **Collisions are computed.** Do not cap a row at an arbitrary `maxGap`. Tighten it only when the
  neighbouring content (a player's companions, the next row) would really collide, and choose which side
  gives way (for example, the selected player's items keep their size).
- A player's items that grow (companions, objects) form a column or a list anchored to the board: the first
  item never moves, and the next ones grow away from it.

## Depth and clicks

- `z` follows `y`: the item lower on screen is in front. Check it in every pile that fans out.
- **Never use a negative `z`**: the item stops being clickable. Raise the board slightly instead, and keep
  the items above 0.
- Neutralise clicks on a board's shadow margin, so it does not steal the click from the cards next to it.
- A selection outline, or a figure dropped on a card, must stay under that card's buttons.
- While a player drags a piece, set `pointer-events: none` on the pieces that must not catch the pointer
  (other players' pawns, figures already on a drop zone).

## Buttons

- Use `ItemMenuButton` (`getItemMenu`) with `menuAlwaysVisible = true` for actions, styled to match the game
  (see odysseus, aurealis). Attach a button to the item it acts on, even "End the story" goes on the last
  story told.
- **Labels are always visible.** Labels that only show on hover do not exist on mobile.
- Keep labels short and put icons in them. Write the cost in the label (`1 [villager] ⇒ 2 [move]`). A
  label made only of icons needs no translation.
- Use an icon alone when the action is obvious (a red cross to discard, a counterclockwise arrow to
  straighten a card).
- Place each button right above the effect it triggers, or next to the marker it changes, without hiding
  the printed effect. With many items side by side, shift every other button up or down so they do not
  collide.
- Prefer a button close to the material over a header button. When a choice concerns a specific token,
  offer the button on the token **and** in the header.

## Selection and drag and drop

- Click-then-target interactions: a click selects an item with a local `select` move and shows it (outline).
  The buttons on targets then act on the selected item. Deselect when a drag starts.
- **Drop areas match the target exactly**, down to the corner radius of the cards. Their label is plain text,
  never a button inside a drop zone. They light up while a compatible item is dragged.
- To let a drop play a legal move that is not a plain move to that location (a custom move, for example),
  override `isMoveToLocation` in the locator (see `arackhan-wars/app/src/locators/FactionCardLocator.tsx`).
  A drag-and-drop can stand in for a custom move without changing the rules.
- On mobile, a drop zone that acts as a button takes a first tap to show its label (like hover on desktop),
  and a second tap to play.

## Hover

- Cards zoom on hover (`getHoverTransform`, around ×2). Pick the transform origin so the zoom stays on screen
  (left-aligned on the left edge, right-aligned on the right edge).
- A player's own face-down card can turn face up on hover. Turn this off while an animation plays on it.

## Animations

- Set the durations in `MaterialGameAnimations`: 0.2 to 0.5 s for most moves, and faster for gains that
  repeat. When the developer gives a figure, use it.
- A flat card that rotates gets no elevation.
- **Hidden players' areas.** Skip every animation that starts and ends inside an area that is not
  displayed. A move between the shared area and a hidden player goes through **a waypoint behind that
  player's panel**, with a scale-down for cards (`.trajectory(...)` with `waypoints` of `{ at, locator,
  location }`, see `greylune/app/src/animations/GameAnimations.ts`). Money spent or gained is animated too.
- **Pauses are waypoints, never moves.** To show a revealed card for a second before it reaches the hand,
  add a waypoint on the reveal locator. Do not add a rule step.
- Give a stock location (coins, tokens) that is drawn on the table, so created items fly from there.

## Player panels

The player's color, the indicators that matter (gold, strength, VP…) on one line, the season or turn marker
with a tooltip, and a click that selects the player (see `PlayerPanelContent` in greylune).

## Logs (`LogDescription`)

- Read each entry from the move and from the state it was played on, **never from memory written for the
  log**. A log that depends on memory will one day describe what the rules no longer do.
- Use two levels: the player's decision, with their avatar, and its consequences indented below it
  (resources, points, moves). Leave out a decision when its consequences already tell it.
- Use icons and item images, with links that open the item's help. Put the live log under the header, with
  `pointer-events: none`.
- A deleted item keeps its index, with `quantity: 0`. Read it from `game.items[type][index]`, because the
  material helpers skip it.

## Scoring and game over

- Use `ScoringDescription` for the end screen: the detail per category (points during the game, quests,
  cards…). Compute everything, and memorise nothing.
- An animated final count (markers advancing point by point, with a header saying what is being counted)
  helps a lot.
- For an unusual victory, explain it with a clickable help on the game over message.

## Theme and sounds

- Build a custom theme from the rulebook's palette and typography (see zenith, aurealis, greylune
  `theme/`). Use `background.jpg` as the background image when one exists.
- Set `soundKit` on the descriptions: `SoundKit.Wood` for meeples and markers, and `Coin` for coins. Add a
  custom sound for a signature moment.
