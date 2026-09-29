"""Bake the Game Park material shadow into a PNG (images at 100 px/cm).

    python shadow.py piece.png out.png --kind cardboard|wood [--replace] [--keep-canvas] [--defringe]

The input is the piece cut out on a transparent background. The shadow has no direction and no offset,
and its length and density depend on the thickness of the piece, not on its size (see
references/assets.md):

    cardboard  dilation 2 px, Gaussian sigma 7 px, opacity 0.36   (tiles, tokens, boards)
    wood       dilation 6 px, Gaussian sigma 7 px, opacity 0.46   (meeples, cubes, markers)

--replace      the input already carries a shadow of uniform colour: estimate it, remove it, then bake
               the new one. The piece's anti-aliased edge is recovered by un-compositing.
--keep-canvas  keep the canvas size, so the sizes declared in MaterialDescription stay valid. Without it,
               the canvas grows by the shadow margin on every side, and the script prints that margin.
--defringe     repaint the magenta cut line of punchboards that sticks to the edge of the piece.

Requires Pillow and numpy.
"""
import argparse
import math

import numpy as np
from PIL import Image, ImageFilter

KINDS = {'cardboard': (2, 7, 0.36), 'wood': (6, 7, 0.46)}
COLOR = np.array([0x1A, 0x11, 0x07], dtype=float)


def dilate(mask, pixels):
    """Grow an 8-bit mask by `pixels` on every side (a square kernel, invisible once blurred)."""
    image = Image.fromarray(mask)
    return np.array(image.filter(ImageFilter.MaxFilter(2 * pixels + 1))) if pixels > 0 else mask


def strip_shadow(rgb, alpha):
    """Separate the piece from a baked shadow of uniform colour, returning (piece_rgb, piece_alpha).

    Over the shadow, an edge pixel of coverage c reads a = c + (1 - c) * s and
    rgb * a = c * piece + (1 - c) * s * shadow_color, where s is the shadow's opacity next to the piece.
    """
    opaque = (alpha >= 0.98).astype(np.uint8) * 255
    ring = (dilate(opaque, 4) > 0) & (dilate(opaque, 2) == 0)
    s = float(np.median(alpha[ring]))
    shade = rgb[ring & (alpha > 0.05)].mean(axis=0)
    print(f'old shadow: opacity {s:.2f} next to the piece, colour {shade.round().astype(int).tolist()}')
    c = np.clip((alpha - s) / (1 - s), 0, 1)
    with np.errstate(divide='ignore', invalid='ignore'):
        piece = (rgb * alpha[..., None] - ((1 - c) * s)[..., None] * shade) / c[..., None]
    piece = np.where(c[..., None] > 0, np.clip(piece, 0, 255), 0)
    return piece, c


def defringe(rgb, alpha, width=6):
    """Repaint the magenta cut line that punchboards print right at the cut, within `width` px of the edge.

    Each magenta pixel of that ring takes the mean colour of its clean neighbours, from the inside out.
    """
    solid = (alpha >= 0.98).astype(np.uint8) * 255
    core = np.array(Image.fromarray(solid).filter(ImageFilter.MinFilter(2 * width + 1))) > 0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    dirty = (alpha > 0) & ~core & (r > 150) & (r - g > 60) & (b > 70)
    print(f'defringe: {dirty.sum()} magenta px repainted on the edge')
    clean = (alpha > 0) & ~dirty
    for _ in range(4 * width):
        if not dirty.any():
            break
        total = np.zeros_like(rgb)
        count = np.zeros(alpha.shape)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                shifted = np.roll(np.roll(clean, dy, 0), dx, 1)
                total += np.roll(np.roll(rgb * clean[..., None], dy, 0), dx, 1)
                count += shifted
        fill = dirty & (count > 0)
        rgb[fill] = total[fill] / count[fill][:, None]
        clean |= fill
        dirty &= ~fill
    return rgb


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('input')
    parser.add_argument('output')
    parser.add_argument('--kind', choices=KINDS, required=True)
    parser.add_argument('--replace', action='store_true')
    parser.add_argument('--keep-canvas', action='store_true')
    parser.add_argument('--defringe', action='store_true')
    args = parser.parse_args()

    source = np.array(Image.open(args.input).convert('RGBA')).astype(float)
    rgb, alpha = source[..., :3], source[..., 3] / 255
    if args.replace:
        rgb, alpha = strip_shadow(rgb, alpha)
    if args.defringe:
        rgb = defringe(rgb, alpha)

    dilation, sigma, opacity = KINDS[args.kind]
    margin = math.ceil(dilation + 2.5 * sigma)  # past it, the shadow is below 1/255
    if not args.keep_canvas:
        rgb = np.pad(rgb, ((margin, margin), (margin, margin), (0, 0)))
        alpha = np.pad(alpha, margin)
        print(f'canvas grown by {margin} px on every side: add it to the size declared in MaterialDescription')

    mask = dilate((alpha * 255).round().astype(np.uint8), dilation)
    blurred = Image.fromarray(mask).filter(ImageFilter.GaussianBlur(sigma))
    shadow = np.array(blurred).astype(float) / 255 * opacity
    border = max(shadow[0].max(), shadow[-1].max(), shadow[:, 0].max(), shadow[:, -1].max())
    if border * 255 >= 2:
        print(f'warning: the shadow is cut by the canvas edge (alpha {border * 255:.0f}/255 there)')

    out_alpha = alpha + (1 - alpha) * shadow
    with np.errstate(divide='ignore', invalid='ignore'):
        out_rgb = (rgb * alpha[..., None] + ((1 - alpha) * shadow)[..., None] * COLOR) / out_alpha[..., None]
    out_rgb = np.nan_to_num(out_rgb)
    result = np.dstack([out_rgb, out_alpha * 255]).round().clip(0, 255).astype(np.uint8)
    Image.fromarray(result, 'RGBA').save(args.output, optimize=True)


if __name__ == '__main__':
    main()
