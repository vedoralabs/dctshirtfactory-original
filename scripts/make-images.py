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
# source file -> output base name.
# Only images with NO logos, text or brand-like marks may be listed here
# (owner brief, 16 Oct 2026). Excluded for marks: hero-placeholder (chest logos,
# sneaker), product-marathon-seperate (chest logo), product-marathon-2 (text + icon),
# product-corporate (text), product-school-uniform-seperate (crest),
# product-hoodies-seperate (emblem), product-trackpants-seperate (logo mark),
# product-school-uniform (brand logo).
IMAGES = {
    "product-school-uniform-2.jpg": "school-set",
    "product-marathon.jpg": "marathon-galaxy",
    "product-corporate-seperate.jpg": "corporate-black",
    "product-gym.jpg": "gym-compression",
    "product-sublimation.jpg": "sublimation-art",
    "product-sublimation-seperate.jpg": "sublimation-sleeve",
    "product-trackpants.jpg": "shorts-navy",
    # Generated 16 Oct 2026 (Runway, logo-free prompts from the owner's brief;
    # each image inspected for marks/text). Logged in docs/content-rights-register.csv.
    "generated/concept-polo-navy-34.png": "polo-navy",
    "generated/concept-hoodie-charcoal-34.png": "hoodie-charcoal",
    "generated/concept-varsity-cream-34.png": "varsity-cream",
    "generated/concept-school-polo-front.png": "school-polo-white",
    "generated/concept-event-tee-orange.png": "event-tee-orange",
    "generated/concept-trackpants-navy-flat.png": "trackpants-navy",
    "generated/concept-cycling-jersey-teal.png": "cycling-jersey-teal",
    "generated/concept-sublimation-wave.png": "sublimation-wave",
    "generated/concept-team-jersey-front-back.png": "team-jersey",
}
# Crops that remove marked garments from an otherwise usable image:
# (source, (left, top, right, bottom), output base name)
CROPS = [
    ("product-hoodies.jpg", (0, 110, 590, 1150), "hoodie-beige"),  # hoodie only, varsity jacket cut out
]
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
for src, box, name in CROPS:
    im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB").crop(box)
    for w in WIDTHS:
        save(im, name, w)

# Delivered work, from the owner's own Instagram posts (thumbnails for the work section).
# These DO show client/event logos: used at the user's request (2 Nov 2026) as an exception
# to the no-logos rule above, credited and linked to each post. Owner approval still pending
# (OWNER-INPUTS.md, docs/content-rights-register.csv). Each is normalised to a 4:3 card:
# (source, crop box or None, padding colour or None, output base name)
WORK = [
    ("instagram/hackfest-tees.jpg", None, (255, 255, 255), "work-hackfest-tees"),
    ("instagram/hackfest-worn.jpg", (0, 364, 600, 700), (0, 0, 0), "work-hackfest-worn"),
    ("instagram/nitte-walkathon-polo.jpg", None, (255, 255, 255), "work-nitte-polo"),
    ("instagram/mangaluru-beach-marathon-tee.jpg", (0, 170, 600, 620), None, "work-beach-marathon"),
    ("instagram/udupi-marathon-jersey.jpg", None, (255, 255, 255), "work-udupi-marathon"),
]
for src, box, padc, name in WORK:
    im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
    if box:
        im = im.crop(box)
    im = ImageOps.pad(im, (640, 480), color=padc, method=Image.LANCZOS) if padc else ImageOps.fit(im, (640, 480), Image.LANCZOS)
    for w in (320, 640):
        save(im, name, w, q=80)

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
icon = Image.new("RGB", (size, size), (14, 15, 16))
mark = Image.open(OUT / "logo-light.png")
mark.thumbnail((int(size * 0.8), int(size * 0.8)), Image.LANCZOS)
icon.paste(mark, ((size - mark.width) // 2, (size - mark.height) // 2), mark)
icon.save(OUT / "icon-512.png", optimize=True)
icon.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", optimize=True)
icon.resize((48, 48), Image.LANCZOS).save(ROOT / "public" / "favicon.ico")

# Open Graph card 1200x630: graphite, headline left, the hero garment right
og = Image.new("RGB", (1200, 630), (14, 15, 16))
garment = ImageOps.fit(Image.open(SRC / "generated/concept-cycling-jersey-teal.png").convert("RGB"), (420, 560), Image.LANCZOS, centering=(0.5, 0.35))
og.paste(garment, (740, 35))
d = ImageDraw.Draw(og)
d.rectangle((740, 35, 1160, 595), outline=(205, 242, 58), width=0)
mark = Image.open(OUT / "logo-light.png")
mark.thumbnail((200, 100), Image.LANCZOS)
og.paste(mark, (64, 52), mark)
try:
    font = ImageFont.truetype("impact.ttf", 92)
    small = ImageFont.truetype("arial.ttf", 26)
except OSError:
    font = small = ImageFont.load_default()
d.text((64, 190), "YOUR TEAM.", font=font, fill=(241, 237, 228))
d.text((64, 292), "YOUR FABRIC.", font=font, fill=(241, 237, 228))
d.text((64, 394), "MADE TO ORDER.", font=font, fill=(205, 242, 58))
d.rectangle((66, 512, 600, 515), fill=(255, 107, 44))
d.text((64, 540), "Custom apparel manufacturing · Mangalore & Tiruppur", font=small, fill=(171, 167, 158))
og.save(OUT / "og-image.jpg", quality=86)
print("done:", len(list(OUT.iterdir())), "files")

# Manifest of intrinsic sizes, read by the HTML build for width/height attrs.
import json
manifest = {}
for f in sorted(OUT.iterdir()):
    if f.suffix in (".webp", ".png", ".jpg"):
        with Image.open(f) as im:
            manifest[f.name] = [im.width, im.height]
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=0))
