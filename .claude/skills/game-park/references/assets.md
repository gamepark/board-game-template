# Assets: images, icons, PDFs, sounds

See the docs first: `step-by-step-example/prepare-the-images.md`, `display-first-item.md`,
`features/cards-with-different-backs.md`, `translate-images.md`.

The publisher's source files (print PDFs, punchboards, icon sheets) usually sit in a shared folder outside
the repo. Ask the developer for its path, and remember it for the project.

## Images

- **Resolution: 100 px per cm** of the physical item. Around 127 dpi is enough for large boards: do not
  upscale them.
- **JPG (quality ~85)** for anything opaque and rectangular (cards, square boards, background). **PNG**
  only when transparency is needed (meeples, shaped tokens and tiles, die-cut boards), with a baked-in
  shadow that matches the piece's thickness (below).
- Trim white borders, and put tiles in reading direction.
- Organise folders the way existing games do (for example `images/cards/<kind>/`, `images/tokens/`,
  `images/icons/`).
- **When you replace an image with a better source, keep the same framing**, so the sizes in `Material.ts`
  and the positions in the locators stay valid.
- Look at the result: pink edges, black squares around a shape and halos are artefacts of cutting it out.
  Fix them before you deliver.
- List the images you could not find, and ask the developer for them. Do not keep images the adaptation
  will not use (the publisher's logo, files the developer removed on purpose).

## Shadow for PNG material

The shadow is baked into the PNG, with no direction and no offset. Its length and density depend on
the **physical thickness of the piece**, not on its size: a large cardboard board casts a short shadow,
while a small wooden meeple casts a thick one.

- **Cardboard** (tiles, tokens, die-cut boards, about 2 mm thick): a **light** shadow that is short and
  soft. It must not darken the cards and tiles laid next to it.
- **Wooden or plastic pieces** (meeples, cubes, markers, about 1 cm thick): a **thicker** shadow that is
  longer and denser, so the piece stands out from the board.

**Use `scripts/shadow.py`** (Pillow + numpy). It dilates the alpha mask, applies a Gaussian blur, tints it
`#1A1107` (a very dark warm brown) and composites the piece on top:

```
python scripts/shadow.py piece.png out.png --kind cardboard|wood [--replace] [--keep-canvas] [--defringe]
```

Its values are for images at 100 px/cm. They are calibrated on the shadows the developer approved in
greylune (`boards/PlayerBoard.png` and the tokens for cardboard, `pawns/*` for wood), and the script
reproduces them to within a few levels of opacity:

| Piece | Dilation | Gaussian σ | Opacity | Resulting halo |
|-------|----------|------------|---------|----------------|
| Cardboard | 2 px | 7 px | 0.36 | ~20 % alpha at the edge, ~6 % at 1 mm, gone by 1.5 to 2 mm |
| Wood (meeple, marker) | 6 px | 7 px | 0.46 | ~36 % alpha at the edge, ~18 % at 1 mm, gone by 2 to 2.5 mm |

The halo is about the same length in both cases. The wooden piece's shadow is mostly **denser** near the
piece, because of the dilation. A large player board and a small token get the same shadow.

- `--replace` removes a shadow already baked into a PNG before adding the right one. It is how a bad
  shadow gets fixed without going back to the source file.
- `--keep-canvas` keeps the image size, so the sizes declared in `MaterialDescription` and the
  coordinates on the piece stay valid. Without it, the canvas grows by the shadow margin, which the script
  prints: add it to the declared size.
- `--defringe` repaints the magenta cut line that punchboards print right at the edge of the pieces.
- Look at one corner of the result on a light background (a small crop, not a screenshot of the app).

Write the recipe and the folder layout down in an `app/src/images/README.md`, so that anyone who redoes a
piece later gets the same result. Apart from the references above, do not copy shadows from existing
games: their values vary, and some are not right.

## Icons cut from a sheet

- **Cut with a flood fill of the connected shape, never with a rectangle.** Shapes on the same sheet
  overlap in x or y, and a rectangle drags in a piece of the neighbour.
- Trim on alpha, and keep transparent pixels white, so no dark halo appears when the icon is scaled.
- Note the order of the families on the sheet in the project memory. It is rarely the order of the enum.
- Temporary icons are fine while you build the headers. The developer replaces them later.

## Rulebook PDFs

- Optimise them for the web before you put them in `app/public/`.
- A PDF too large for `Read`: render the page (`pdftoppm -png -r 200`) and read it as an image.
  `pdftotext -layout` scrambles two-column layouts.

## Sounds

Look for a sound on a stock library (such as Envato), import it, and wire it to the move it illustrates
(see `features/configure-the-animations.md` for the durations and `soundKit` in `references/front.md`).
