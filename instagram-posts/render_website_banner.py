import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_PATH = os.path.join(OUT_DIR, "banner-website-theme.html")
FULL_PNG = os.path.join(OUT_DIR, "banner-full-3240x1350.png")

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def get_font(size, bold=False, mono=False):
    win_fonts = r"C:\Windows\Fonts"
    if mono:
        candidates = ["consolab.ttf" if bold else "consola.ttf"]
    elif bold:
        candidates = ["segoeuib.ttf", "arialbd.ttf"]
    else:
        candidates = ["segoeui.ttf", "arial.ttf"]
    for c in candidates:
        p = os.path.join(win_fonts, c)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def render_and_slice():
    file_url = "file:///" + HTML_PATH.replace("\\", "/")
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=3240,1350",
        f"--screenshot={FULL_PNG}",
        file_url,
    ]
    subprocess.run(cmd, check=True)

    canvas = Image.open(FULL_PNG).convert("RGB")
    if canvas.size != (3240, 1350):
        canvas = canvas.crop((0, 0, 3240, 1350))
        canvas.save(FULL_PNG, "PNG")

    t1 = canvas.crop((0, 0, 1080, 1350))
    t2 = canvas.crop((1080, 0, 2160, 1350))
    t3 = canvas.crop((2160, 0, 3240, 1350))

    p_t1 = os.path.join(OUT_DIR, "banner-tile-1-left-post3rd.png")
    p_t2 = os.path.join(OUT_DIR, "banner-tile-2-center-post2nd.png")
    p_t3 = os.path.join(OUT_DIR, "banner-tile-3-right-post1st.png")

    t1.save(p_t1, "PNG")
    t2.save(p_t2, "PNG")
    t3.save(p_t3, "PNG")

    # Build Light-Mode Instagram Profile Mockup matching the website
    MW, MH = 1440, 1320
    mock = Image.new("RGB", (MW, MH), (250, 247, 242)) # #faf7f2
    d = ImageDraw.Draw(mock)

    CARBON = (18, 19, 22)
    MUTED = (82, 85, 95)
    TERRA = (217, 83, 47)
    WHITE = (255, 255, 255)

    f_handle = get_font(34, bold=True)
    f_name = get_font(26, bold=True)
    f_bio = get_font(24, bold=False)
    f_link = get_font(24, bold=True)
    f_stat_n = get_font(30, bold=True)
    f_stat_l = get_font(21, bold=False)
    f_tab = get_font(20, bold=True, mono=True)

    # Profile Avatar
    av_x, av_y, av_r = 165, 175, 76
    d.ellipse((av_x - av_r - 5, av_y - av_r - 5, av_x + av_r + 5, av_y + av_r + 5), outline=TERRA, width=4)
    d.ellipse((av_x - av_r, av_y - av_r, av_x + av_r, av_y + av_r), fill=WHITE, outline=(228, 224, 216), width=2)
    d.text((av_x - 36, av_y - 52), "q", font=get_font(84, bold=True), fill=CARBON)
    d.ellipse((av_x + 22, av_y + 14, av_x + 40, av_y + 32), fill=TERRA)

    d.text((310, 72), "qualfi.io", font=f_handle, fill=CARBON)
    stats = [("3", "posts"), ("4.8K", "followers"), ("142", "following")]
    for i, (sn, sl) in enumerate(stats):
        sx = 310 + i * 200
        d.text((sx, 132), sn, font=f_stat_n, fill=CARBON)
        d.text((sx, 170), sl, font=f_stat_l, fill=MUTED)

    d.text((310, 220), "qualfi — Make your bio do the heavy lifting.", font=f_name, fill=CARBON)
    d.text((310, 258), "Bespoke 60-sec Macro & Split Diagnostics for fitness coaches.\n0–100 purchase intent scoring + < 2s WhatsApp lead routing.", font=f_bio, fill=MUTED, spacing=6)
    d.text((310, 334), "qualfi.io/#demo", font=f_link, fill=TERRA)

    d.line([(60, 410), (MW - 60, 410)], fill=(226, 221, 212), width=2)
    d.line([(595, 410), (845, 410)], fill=CARBON, width=3)
    d.text((618, 426), "PINNED 3-POST BANNER", font=f_tab, fill=CARBON)

    grid_y = 478
    tile_w = 428
    tile_h = int(tile_w * 1350 / 1080)
    gap = 8
    start_x = (MW - (tile_w * 3 + gap * 2)) // 2

    # White frame behind grid
    d.rounded_rectangle((start_x - 12, grid_y - 12, start_x + tile_w * 3 + gap * 2 + 12, grid_y + tile_h + 12),
                        radius=20, fill=WHITE, outline=(228, 223, 214), width=2)

    for idx, tile_img in enumerate([t1, t2, t3]):
        resized = tile_img.resize((tile_w, tile_h), Image.Resampling.LANCZOS)
        tx = start_x + idx * (tile_w + gap)
        mock.paste(resized, (tx, grid_y))
        order_lbl = ["3. UPLOAD 3RD (LEFT)", "2. UPLOAD 2ND (CENTER)", "1. UPLOAD 1ST (RIGHT)"][idx]
        d.text((tx + 12, grid_y + tile_h + 24), order_lbl, font=get_font(18, bold=True, mono=True), fill=TERRA if idx == 1 else MUTED)

    mock_path = os.path.join(OUT_DIR, "instagram-profile-banner-mockup.png")
    mock.save(mock_path, "PNG")
    print("Successfully rendered website-themed 3-post banner and profile mockup!")

if __name__ == "__main__":
    render_and_slice()
