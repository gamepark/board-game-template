# Texts: headers, help, tutorial, translations

See the docs first: `step-by-step-example/write-the-headers.md`, `help-dialogs.md`, `tutorial.md`,
`features/translate-images.md`. While developing, write texts only in the developer's language
(`CLAUDE.md`).

## Headers

- **Short.** They must still fit once translated into German. Cut every clause that is not needed ("without
  looking at its front").
- **No full stop at the end.** A question mark stays. The header bar is a label, not prose.
- **Put the buttons inside the sentence**: "Place a [villager] or [go to summer]". It is fine to write more
  sentence variants to achieve this.
- **Be specific to the situation**: "Activate Neris or [pass]", not "Choose an option of the card". A header
  that goes generic often reveals a rule that mixes two decisions.
- Show a text for the waiting players too ("Sharky activates the squares of the zone").
- Branch on the active player, never on the legal moves (see `SKILL.md`).

## Help dialogs

- **Follow the rulebook's wording and vocabulary**, and check every sentence against its page before you
  deliver it. Frequent mistakes: invented terms ("zones" instead of "spaces"), wrong restrictions, details
  that are not in the rulebook, and paraphrases that change the meaning ("the first one takes the richest"
  instead of "the space worth the most VP at the end of the game").
- What the code does beyond the rulebook does not go in the text.
- When the French and English rulebooks disagree, find out which one the code follows and ask the developer.
- Every item and every location has a help. The help of an item in a location can open that location's help.
- **Share texts between dialogs** (the paragraph explaining a token appears as is in the board's help)
  instead of duplicating them. Reuse the keys of the `common` namespace ("Close"…).
- Put an icon next to each section title, and make in-text links discreet (a simple underline, as in
  mythologies).
- A rule point that is easy to miss goes in bold in the help of the cards it affects. If an item cannot
  be used because of that rule, add a padlock button on the item that recalls the rule (only when the item
  would be usable without it).

## Tutorial

- **The developer writes the scenario.** One line of it = one tutorial step. Improve the wording, add bold
  and icons, but keep the content. When asked for "just the texts", deliver only the texts.
- **House tone: plain and direct.** The developer rejected every literary flourish ("and that is what decides
  the game", "But a back is not silent"). Read two or three existing tutorials (leda, aurealis,
  odysseus) before writing.
- **Never name a concept before its material is on screen and focused.** Break one introduction into two or
  three steps if needed. Introduce each part of a card at the action that uses it, not as a block up front.
- **Focus exactly what the text talks about**: the opponent's pawns when the text talks about them, the
  tile about to be won, the pawns on a card but not the extra ones. To highlight part of a card (its 3 animal
  slots), create a dedicated `LocationType` just for the focus (see chateau-combo).
- Right after the welcome, add a step about the game's theme.
- Teach the player to click for help, in italics on a new line of the relevant steps ("At any time, click an
  element to learn what it does").
- Randomise the setup as much as possible, and fix only what the script needs in `TutorialSetup`. Name the
  opponent after the author, with an avatar.
- Test the tutorial in vitest: play the script to the end with `wrapRulesWithTutorial`. A step that waits
  for a move that the random setup sometimes does not allow blocks the tutorial.

## Typography and ICU

- The texts are ICU messages: a `'` right before `{`, `}` or `<` opens a quoted literal and disappears
  (`l'<strong>Éveil</strong>` loses its apostrophe). Move the apostrophe inside the tag
  (`<strong>l'Éveil</strong>`), or use the typographic `’`.
- In French, put a non-breaking space before `: ; ? !`, or the punctuation wraps to the next line alone.
- A key that shows up as "Missing key: leda|<the French text>" means the text was passed as `defaults`
  without a key, or the key is missing from that locale.

## Translation pass (before release, when asked)

- English: take the glossary from `rules-en.pdf`. Other languages: translate the original rulebook's
  wording as closely as possible.
- When the developer edits a text, carry the change over to every other locale.
- Replace words with icons wherever it reads as well ("1 <magic> and 2 <vp>"). There is nothing left to
  translate.
- Committing translations does not ship them. Check that they are deployed (`references/debugging.md`).
