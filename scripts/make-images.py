"""Turn the source photos in assets/ into web-ready WebP files in public/img/.

Run with:  python scripts/make-images.py
Re-run whenever a photo in assets/ is replaced (keep the same file names, or
update IMAGES below and src/data.mjs).
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OUT = ROOT / "public" / "img"
OUT.mkdir(parents=True, exist_ok=True)

# source file -> output base name
IMAGES = {
    "product-school-uniform-2.jpg": "school-set",
    "product-school-uniform-seperate.jpg": "school-polo",
    "product-marathon-2.jpg": "marathon-green",
    "product-marathon-seperate.jpg": "marathon-jersey",
    "product-marathon.jpg": "marathon-galaxy",
    "product-corporate.jpg": "corporate-white",
    "product-corporate-seperate.jpg": "corporate-black",
    "product-gym.jpg": "gym-compression",
    "product-hoodies.jpg": "hoodie-varsity",
    "product-hoodies-seperate.jpg": "hoodie-grey",
    "product-sublimation.jpg": "sublimation-art",
    "product-sublimation-seperate.jpg": "sublimation-sleeve",
    "product-trackpants-seperate.jpg": "trackpants-set",
    "product-trackpants.jpg": "shorts-navy",
    "hero-placeholder.jpg": "flatlay",
}
WIDTHS = (480, 960)


def save(im, name, w, q=78):
    im = im.copy()
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(OUT / f"{name}-{w}.webp", "WEBP", quality=q, method=6)


def grade(im):
    """Dark, contrasty 'cinematic' grade for hero frames."""
    im = ImageEnhance.Contrast(im).enhance(1.25)
    im = ImageEnhance.Brightness(im).enhance(0.55)
    im = ImageEnhance.Color(im).enhance(0.9)
    # vignette
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((-w * 0.15, -h * 0.25, w * 1.15, h * 1.25), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.18))
    black = Image.new("RGB", (w, h), (8, 8, 9))
    return Image.composite(im, black, mask)


for src, name in IMAGES.items():
    im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
    for w in WIDTHS:
        save(im, name, w)

# Hero frames: graded, wide crops
HERO = ["hero-placeholder.jpg", "product-marathon-seperate.jpg",
        "product-sublimation.jpg", "product-hoodies.jpg"]
for i, src in enumerate(HERO, 1):
    im = Image.open(SRC / src).convert("RGB")
    # crop to 16:10-ish around centre
    tw, th = im.width, round(im.width * 10 / 16)
    if th > im.height:
        th = im.height
        tw = round(th * 16 / 10)
    left = (im.width - tw) // 2
    top = (im.height - th) // 2
    im = grade(im.crop((left, top, left + tw, top + th)))
    for w in (800, 1600):
        save(im, f"hero-{i}", w, q=70)

# Logo: black-on-white JPEG -> warm off-white on transparent PNG, tightly cropped
logo = Image.open(SRC / "DC LOGO.jpeg").convert("L")
alpha = ImageOps.invert(logo).point(lambda v: 0 if v < 40 else min(255, int((v - 40) * 1.3)))
bbox = alpha.getbbox()
alpha = alpha.crop(bbox)
pad = 8
canvas = Image.new("L", (alpha.width + pad * 2, alpha.height + pad * 2), 0)
canvas.paste(alpha, (pad, pad))
for name, rgb in (("logo-light", (243, 238, 230)), ("logo-dark", (14, 14, 15))):
    out = Image.new("RGBA", canvas.size, rgb + (0,))
    out.putalpha(canvas)
    out.save(OUT / f"{name}.png", optimize=True)

# Favicon / touch icon: logo on charcoal with accent underline
size = 512
icon = Image.new("RGB", (size, size), (11, 11, 12))
mark = Image.open(OUT / "logo-light.png")
mark.thumbnail((int(size * 0.8), int(size * 0.8)), Image.LANCZOS)
icon.paste(mark, ((size - mark.width) // 2, (size - mark.height) // 2), mark)
icon.save(OUT / "icon-512.png", optimize=True)
icon.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", optimize=True)
icon.resize((48, 48), Image.LANCZOS).save(ROOT / "public" / "favicon.ico")

# Open Graph card 1200x630
og = Image.open(SRC / "hero-placeholder.jpg").convert("RGB")
og = ImageOps.fit(og, (1200, 630), Image.LANCZOS)
og = grade(og)
shade = Image.new("RGBA", og.size, (11, 11, 12, 0))
d = ImageDraw.Draw(shade)
for x in range(1200):
    a = int(235 * max(0, 1 - x / 900))
    d.line([(x, 0), (x, 630)], fill=(11, 11, 12, a))
og = Image.alpha_composite(og.convert("RGBA"), shade)
mark = Image.open(OUT / "logo-light.png")
mark.thumbnail((220, 120), Image.LANCZOS)
og.paste(mark, (70, 60), mark)
d = ImageDraw.Draw(og)
try:
    font = ImageFont.truetype("impact.ttf", 76)
    small = ImageFont.truetype("arial.ttf", 30)
except OSError:
    font = small = ImageFont.load_default()
d.text((70, 250), "CUSTOM APPAREL,", font=font, fill=(243, 238, 230))
d.text((70, 335), "MADE FOR YOUR TEAM.", font=font, fill=(255, 90, 31))
d.text((70, 450), "Uniforms • Jerseys • Polos • Hoodies — Mangalore & Tiruppur", font=small, fill=(200, 194, 186))
og.convert("RGB").save(OUT / "og-image.jpg", quality=85)
print("done:", len(list(OUT.iterdir())), "files")

# Manifest of intrinsic sizes, read by the HTML build for width/height attrs.
import json
manifest = {}
for f in sorted(OUT.iterdir()):
    if f.suffix in (".webp", ".png", ".jpg"):
        with Image.open(f) as im:
            manifest[f.name] = [im.width, im.height]
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=0))
