"""Generates the placeholder brand assets (until the client supplies a logo).

Run: python3 scripts/generate-placeholder-assets.py   (requires Pillow)
Outputs into ./assets: icon.png, splash-icon.png, splash-icon-dark.png,
android-icon-foreground.png, android-icon-monochrome.png, notification-icon.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
FONTS = ROOT / "node_modules" / "@expo-google-fonts"
SERIF_ITALIC = FONTS / "cormorant-garamond/500Medium_Italic/CormorantGaramond_500Medium_Italic.ttf"
SANS = FONTS / "manrope/600SemiBold/Manrope_600SemiBold.ttf"

IVORY = (251, 247, 244)
BLUSH = (243, 222, 214)
ROSE = (150, 92, 79)
CHAMPAGNE = (184, 149, 106)
PLUM = (43, 32, 36)
LIGHT = (246, 238, 234)
ROSE_GOLD = (226, 179, 160)


def gradient(size, top, bottom):
    img = Image.new("RGB", (size, size), top)
    px = img.load()
    for y in range(size):
        t = y / (size - 1)
        c = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        for x in range(size):
            px[x, y] = c
    return img


def centered_text(draw, box_w, y, text, font, fill, tracking=0):
    if tracking:
        widths = [draw.textlength(ch, font=font) for ch in text]
        total = sum(widths) + tracking * (len(text) - 1)
        x = (box_w - total) / 2
        for ch, w in zip(text, widths):
            draw.text((x, y), ch, font=font, fill=fill)
            x += w + tracking
    else:
        w = draw.textlength(text, font=font)
        draw.text(((box_w - w) / 2, y), text, font=font, fill=fill)


def monogram(size, color, ring=None, transparent=False, scale=1.0):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0)) if transparent else gradient(size, BLUSH, IVORY).convert("RGBA")
    d = ImageDraw.Draw(img)
    if ring:
        r = size * 0.33 * scale
        c = size / 2
        d.ellipse((c - r, c - r, c + r, c + r), outline=ring, width=max(2, round(size * 0.006)))
    f = ImageFont.truetype(str(SERIF_ITALIC), round(size * 0.52 * scale))
    bbox = d.textbbox((0, 0), "S", font=f)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1] - size * 0.01), "S", font=f, fill=color)
    return img


def wordmark(text_color, accent, rule):
    W, H = 900, 520
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    serif = ImageFont.truetype(str(SERIF_ITALIC), 230)
    sans = ImageFont.truetype(str(SANS), 58)
    centered_text(d, W, 40, "Studio", serif, text_color)
    d.line((W / 2 - 70, 330, W / 2 + 70, 330), fill=rule, width=4)
    centered_text(d, W, 370, "BEAUTY", sans, accent, tracking=30)
    return img


def main():
    ASSETS.mkdir(exist_ok=True)
    monogram(1024, ROSE, ring=CHAMPAGNE).convert("RGB").save(ASSETS / "icon.png")
    wordmark(PLUM, ROSE, CHAMPAGNE).save(ASSETS / "splash-icon.png")
    wordmark(LIGHT, ROSE_GOLD, CHAMPAGNE).save(ASSETS / "splash-icon-dark.png")
    monogram(1024, ROSE, ring=CHAMPAGNE, transparent=True, scale=0.62).save(ASSETS / "android-icon-foreground.png")
    monogram(1024, (255, 255, 255), transparent=True, scale=0.62).save(ASSETS / "android-icon-monochrome.png")
    monogram(96, (255, 255, 255), transparent=True, scale=1.3).save(ASSETS / "notification-icon.png")
    print("assets written to", ASSETS)


if __name__ == "__main__":
    main()
