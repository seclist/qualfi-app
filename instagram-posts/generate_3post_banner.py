import os
import math
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Wabi-Sabi & Swiss Palette (from AGENTS.md)
CHARCOAL = (24, 23, 21)        # #181715 Deep Charcoal
CHARCOAL_ELEV = (34, 32, 29)   # #22201D Soft Charcoal Card
CHARCOAL_LINE = (46, 43, 39)   # Subtle Grid Line on Dark
STONE = (244, 240, 234)        # #F4F0EA Warm Alabaster Stone
CLAY = (217, 200, 184)         # #D9C8B8 Raw Clay
MUTED = (148, 138, 126)        # #948A7E Warm Muted Stone
TERRACOTTA = (200, 90, 50)     # #C85A32 Kiln Terracotta
SAGE = (114, 138, 116)         # #728A74 Organic Sage
WHITE = (255, 255, 255)

def get_font(size, bold=False, mono=False):
    win_fonts = r"C:\Windows\Fonts"
    if mono:
        candidates = ["consolab.ttf" if bold else "consola.ttf", "courbd.ttf" if bold else "cour.ttf"]
    elif bold:
        candidates = ["arialbd.ttf", "segoeuib.ttf", "calibrib.ttf"]
    else:
        candidates = ["arial.ttf", "segoeui.ttf", "calibri.ttf"]
    for c in candidates:
        p = os.path.join(win_fonts, c)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def draw_pill(draw, x, y, text, font, fg, bg, pad_x=24, pad_y=12, outline=None):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    w = tw + pad_x * 2
    h = th + pad_y * 2
    draw.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=bg, outline=outline, width=2 if outline else 0)
    draw.text((x + pad_x, y + pad_y - bbox[1]), text, font=font, fill=fg)
    return w, h

def build_panoramic_banner():
    # 3 tiles of 1080 x 1350 -> 3240 x 1350
    W, H = 3240, 1350
    TW = 1080
    canvas = Image.new("RGB", (W, H), CHARCOAL)
    draw = ImageDraw.Draw(canvas)

    # 1. Subtle Swiss Architectural Grid across all 3 tiles
    for x in range(0, W, 180):
        draw.line([(x, 0), (x, H)], fill=CHARCOAL_LINE, width=1)
    for y in range(0, H, 150):
        draw.line([(0, y), (W, y)], fill=CHARCOAL_LINE, width=1)

    # 2. Continuous Background Geometric Arcs & Flow Line spanning all 3 tiles
    # Large subtle Wabi-Sabi Enso-inspired circle centered in Tile 2 but bleeding into Tile 1 and Tile 3
    cx, cy = 1620, 675
    for r, col, w in [(590, (42, 39, 35), 2), (760, (38, 35, 31), 2), (960, (33, 31, 28), 2)]:
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=col, width=w)

    # Continuous horizontal signal line at y = 855 connecting Tile 1 -> Tile 2 -> Tile 3
    line_y = 855
    draw.line([(120, line_y), (3120, line_y)], fill=(68, 63, 56), width=3)
    # Highlighted terracotta active signal segment across the seams (x=920 to x=2320)
    draw.line([(860, line_y), (2380, line_y)], fill=TERRACOTTA, width=4)

    # Seam connector pills that physically bridge Tile 1->2 (x=1080) and Tile 2->3 (x=2160)
    f_mono_xs = get_font(22, bold=True, mono=True)
    f_mono_sm = get_font(25, bold=True, mono=True)
    f_mono_md = get_font(30, bold=True, mono=True)
    f_brand_huge = get_font(128, bold=True)
    f_head = get_font(82, bold=True)
    f_sub = get_font(34, bold=False)
    f_card_title = get_font(36, bold=True)
    f_card_val = get_font(56, bold=True)

    # Top Continuous Header Rule across all 3 tiles
    draw.line([(120, 155), (3120, 155)], fill=CHARCOAL_LINE, width=2)
    draw.text((120, 102), "01 // THE PROBLEM", font=f_mono_sm, fill=MUTED)
    draw.text((1415, 102), "02 // THE SYSTEM", font=f_mono_sm, fill=TERRACOTTA)
    draw.text((2280, 102), "03 // THE PAYOFF", font=f_mono_sm, fill=MUTED)

    # ==========================================================================
    # TILE 1 (LEFT: x = 0..1080) — "KILL YOUR LINKTREE."
    # ==========================================================================
    t1_x = 120
    draw_pill(draw, t1_x, 215, "DEAD BIO LINKS", f_mono_xs, CHARCOAL, CLAY, pad_x=20, pad_y=10)
    draw.text((t1_x, 295), "KILL YOUR\nLINKTREE.", font=f_head, fill=STONE, spacing=12)
    draw.text((t1_x, 515), "Static forms & \"DM me READY\"\nlose 86% of warm prospects.", font=f_sub, fill=CLAY, spacing=10)

    # Minimalist Visual Card on Tile 1 (straddling the y=855 signal line)
    c1_x1, c1_y1, c1_x2, c1_y2 = 120, 660, 960, 1050
    draw.rounded_rectangle((c1_x1, c1_y1, c1_x2, c1_y2), radius=28, fill=CHARCOAL_ELEV, outline=(62, 58, 52), width=2)

    # Crossed out old funnel items inside card
    old_rows = [
        ("Linktree / Beacons Menu", "14% tap rate"),
        ("15-Question Google Form", "High drop-off"),
        ("\"DM Me READY\" Waitlist", "18h reply delay")
    ]
    ry = c1_y1 + 52
    for label, stat in old_rows:
        draw.rounded_rectangle((c1_x1 + 40, ry, c1_x2 - 40, ry + 86), radius=16, fill=CHARCOAL, outline=CHARCOAL_LINE, width=1)
        draw.text((c1_x1 + 72, ry + 26), label, font=f_sub, fill=MUTED)
        # Strikethrough line on the old way
        tw = draw.textlength(label, font=f_sub)
        draw.line([(c1_x1 + 72, ry + 45), (c1_x1 + 72 + tw, ry + 45)], fill=TERRACOTTA, width=3)
        draw.text((c1_x2 - 295, ry + 28), stat, font=f_mono_sm, fill=TERRACOTTA)
        ry += 104

    draw.text((120, 1185), "STOP CHASING COLD LEADS", font=f_mono_sm, fill=MUTED)

    # ==========================================================================
    # TILE 2 (CENTER: x = 1080..2160) — "qualfi." BRAND CENTERPIECE
    # ==========================================================================
    # Center brand badge
    b2_text = "BESPOKE DIAGNOSTIC MICRO-TOOLS"
    b2_w = draw.textlength(b2_text, font=f_mono_xs) + 48
    draw_pill(draw, 1620 - b2_w // 2, 215, b2_text, f_mono_xs, WHITE, TERRACOTTA, pad_x=24, pad_y=10)

    # Giant "qualfi." wordmark centered
    q_text = "qualfi"
    q_bbox = draw.textbbox((0, 0), q_text, font=f_brand_huge)
    q_w = q_bbox[2] - q_bbox[0]
    dot_r = 16
    total_qw = q_w + dot_r * 2 + 12
    qx = 1620 - total_qw // 2
    qy = 290
    draw.text((qx, qy), q_text, font=f_brand_huge, fill=STONE)
    # Signature Terracotta Dot
    dot_x = qx + q_w + 12 + dot_r
    dot_y = qy + (q_bbox[3] - dot_r)
    draw.ellipse((dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r), fill=TERRACOTTA)

    sub2 = "Turn bio clicks into custom macros, splits & scored buyers."
    sub2_w = draw.textlength(sub2, font=f_sub)
    draw.text((1620 - sub2_w // 2, 495), sub2, font=f_sub, fill=CLAY)

    # Center Interactive Diagnostic Card (Light Warm Stone for Hero Contrast!)
    c2_x1, c2_y1, c2_x2, c2_y2 = 1190, 640, 2050, 1070
    draw.rounded_rectangle((c2_x1, c2_y1, c2_x2, c2_y2), radius=32, fill=STONE, outline=CLAY, width=3)

    draw.text((c2_x1 + 48, c2_y1 + 42), "60-SECOND VALUE EXCHANGE", font=f_mono_sm, fill=TERRACOTTA)
    draw.text((c2_x1 + 48, c2_y1 + 88), "Macro & Training Split Engine", font=f_card_title, fill=CHARCOAL)

    # 3 Mini Pillars inside Center Card
    pillars = [
        ("2,340", "KCAL TDEE"),
        ("185g P", "CUSTOM MACROS"),
        ("4-DAY", "OPTIMAL SPLIT")
    ]
    pw = (c2_x2 - c2_x1 - 96 - 32) // 3
    for i, (pval, plbl) in enumerate(pillars):
        px = c2_x1 + 48 + i * (pw + 16)
        py = c2_y1 + 165
        draw.rounded_rectangle((px, py, px + pw, py + 155), radius=20, fill=WHITE, outline=(225, 218, 208), width=2)
        draw.text((px + 24, py + 28), pval, font=get_font(44, bold=True), fill=CHARCOAL)
        draw.text((px + 24, py + 98), plbl, font=f_mono_xs, fill=TERRACOTTA if i == 0 else MUTED)

    # Bottom bar inside center card
    draw.rounded_rectangle((c2_x1 + 48, c2_y1 + 345, c2_x2 - 48, c2_y1 + 395), radius=14, fill=CHARCOAL)
    draw.text((c2_x1 + 78, c2_y1 + 357), "DOHERTY THRESHOLD SPEED < 400MS  •  82%+ COMPLETION", font=f_mono_xs, fill=STONE)

    foot2 = "BUILT FOR FITNESS COACHES & PERSONAL TRAINERS"
    foot2_w = draw.textlength(foot2, font=f_mono_sm)
    draw.text((1620 - foot2_w // 2, 1185), foot2, font=f_mono_sm, fill=STONE)

    # ==========================================================================
    # TILE 3 (RIGHT: x = 2160..3240) — "< 2s TO WHATSAPP."
    # ==========================================================================
    t3_x = 2280
    draw_pill(draw, t3_x, 215, "INSTANT HANDSHAKE", f_mono_xs, WHITE, SAGE, pad_x=20, pad_y=10)
    draw.text((t3_x, 295), "< 2 SEC TO\nWHATSAPP.", font=f_head, fill=STONE, spacing=12)
    draw.text((t3_x, 515), "Every lead is scored 0–100 &\ndispatched while they're active.", font=f_sub, fill=CLAY, spacing=10)

    # Minimalist WhatsApp Payload Card on Tile 3
    c3_x1, c3_y1, c3_x2, c3_y2 = 2280, 660, 3120, 1050
    draw.rounded_rectangle((c3_x1, c3_y1, c3_x2, c3_y2), radius=28, fill=CHARCOAL_ELEV, outline=TERRACOTTA, width=3)

    # Top row inside card: Score 94/100
    draw.text((c3_x1 + 44, c3_y1 + 40), "VERIFIED HOT LEAD PAYLOAD", font=f_mono_xs, fill=CLAY)
    draw.text((c3_x1 + 44, c3_y1 + 82), "94 / 100", font=get_font(68, bold=True), fill=TERRACOTTA)
    draw_pill(draw, c3_x1 + 355, c3_y1 + 98, "READY THIS WEEK", f_mono_xs, CHARCOAL, CLAY, pad_x=20, pad_y=10)

    # Clean data summary rows
    draw.line([(c3_x1 + 44, c3_y1 + 190), (c3_x2 - 44, c3_y1 + 190)], fill=CHARCOAL_LINE, width=2)
    draw.text((c3_x1 + 44, c3_y1 + 215), "Goal: Lean Recomp  •  4x/wk Upper/Lower", font=f_sub, fill=STONE)
    draw.text((c3_x1 + 44, c3_y1 + 268), "Unlocked: 2,340 kcal (185P / 235C / 73F)", font=f_sub, fill=CLAY)
    draw.text((c3_x1 + 44, c3_y1 + 325), ">> Sent to Coach's WhatsApp in 1.4s", font=f_mono_sm, fill=SAGE)

    draw.text((t3_x, 1185), "TAP BIO LINK TO TEST LIVE ->", font=f_mono_sm, fill=TERRACOTTA)

    # ==========================================================================
    # SEAM BRIDGES (At x=1080 and x=2160 so the 3 tiles lock together visually)
    # ==========================================================================
    for seam_x in [1080, 2160]:
        # Glowing node across the seam at line_y = 855
        draw.ellipse((seam_x - 36, line_y - 36, seam_x + 36, line_y + 36), fill=TERRACOTTA, outline=STONE, width=4)
        draw.text((seam_x - 14, line_y - 16), "->", font=f_mono_sm, fill=WHITE)

    # Bottom Continuous Rule across all 3 tiles
    draw.line([(120, 1245), (3120, 1245)], fill=CHARCOAL_LINE, width=2)

    # Save full panoramic master
    full_path = os.path.join(OUT_DIR, "banner-full-3240x1350.png")
    canvas.save(full_path, "PNG")

    # Slice into 3 individual 1080x1350 Instagram tiles
    t1 = canvas.crop((0, 0, 1080, 1350))
    t2 = canvas.crop((1080, 0, 2160, 1350))
    t3 = canvas.crop((2160, 0, 3240, 1350))

    p_t1 = os.path.join(OUT_DIR, "banner-tile-1-left-post3rd.png")
    p_t2 = os.path.join(OUT_DIR, "banner-tile-2-center-post2nd.png")
    p_t3 = os.path.join(OUT_DIR, "banner-tile-3-right-post1st.png")

    t1.save(p_t1, "PNG")
    t2.save(p_t2, "PNG")
    t3.save(p_t3, "PNG")

    # Build a realistic Instagram Profile Page Preview Mockup
    build_ig_profile_mockup(t1, t2, t3)
    return full_path, p_t1, p_t2, p_t3

def build_ig_profile_mockup(t1, t2, t3):
    # Create an Instagram Dark/Stone Profile Grid preview showing the 3-post banner pinned at top
    MW, MH = 1440, 1320
    mock = Image.new("RGB", (MW, MH), (14, 14, 13))
    d = ImageDraw.Draw(mock)

    f_handle = get_font(34, bold=True)
    f_name = get_font(28, bold=True)
    f_bio = get_font(25, bold=False)
    f_link = get_font(25, bold=True)
    f_stat_n = get_font(32, bold=True)
    f_stat_l = get_font(22, bold=False)
    f_tab = get_font(22, bold=True, mono=True)

    # Profile Header
    # Avatar circle with "Q." logo
    av_x, av_y, av_r = 160, 175, 78
    d.ellipse((av_x - av_r - 5, av_y - av_r - 5, av_x + av_r + 5, av_y + av_r + 5), outline=TERRACOTTA, width=4)
    d.ellipse((av_x - av_r, av_y - av_r, av_x + av_r, av_y + av_r), fill=STONE)
    d.text((av_x - 36, av_y - 48), "Q", font=get_font(82, bold=True), fill=CHARCOAL)
    d.ellipse((av_x + 28, av_y + 18, av_x + 46, av_y + 36), fill=TERRACOTTA)

    # Handle & Stats
    d.text((310, 75), "qualfi.io", font=f_handle, fill=WHITE)
    stats = [("3", "posts"), ("4.8K", "followers"), ("142", "following")]
    for i, (sn, sl) in enumerate(stats):
        sx = 310 + i * 210
        d.text((sx, 135), sn, font=f_stat_n, fill=WHITE)
        d.text((sx, 175), sl, font=f_stat_l, fill=MUTED)

    # Bio Copy
    d.text((310, 225), "Qualfi — Bespoke Diagnostic Micro-Tools for Coaches", font=f_name, fill=STONE)
    d.text((310, 265), "Kill your dead Linktree & static contact forms.\n60-sec Macro & Split Diagnostics -> Scored leads on WhatsApp in < 2s.", font=f_bio, fill=CLAY, spacing=6)
    d.text((310, 340), "qualfi.io/diagnostic-demo", font=f_link, fill=TERRACOTTA)

    # Grid Divider & Tab
    d.line([(60, 415), (MW - 60, 415)], fill=(40, 38, 35), width=2)
    d.line([(620, 415), (820, 415)], fill=WHITE, width=3)
    d.text((645, 432), "POSTS // PINNED BANNER", font=f_tab, fill=WHITE)

    # 3-Column Instagram Grid (4:5 aspect ratio tiles with 8px gap)
    grid_y = 485
    tile_w = 428
    tile_h = int(tile_w * 1350 / 1080)  # 535px
    gap = 8
    start_x = (MW - (tile_w * 3 + gap * 2)) // 2

    for idx, tile_img in enumerate([t1, t2, t3]):
        resized = tile_img.resize((tile_w, tile_h), Image.Resampling.LANCZOS)
        tx = start_x + idx * (tile_w + gap)
        mock.paste(resized, (tx, grid_y))
        # Subtle pin icon in top-right of each tile
        d.rounded_rectangle((tx + tile_w - 135, grid_y + 14, tx + tile_w - 14, grid_y + 46), radius=8, fill=(24, 23, 21))
        order_lbl = ["POST 3RD", "POST 2ND", "POST 1ST"][idx]
        d.text((tx + tile_w - 122, grid_y + 20), order_lbl, font=get_font(18, bold=True, mono=True), fill=CLAY)

    # Footer instruction in mockup
    d.text((start_x, grid_y + tile_h + 32), "UPLOAD ORDER:  1. Right Tile (Post 1st)   ->   2. Center Tile (Post 2nd)   ->   3. Left Tile (Post 3rd)", font=f_tab, fill=CLAY)

    mock_path = os.path.join(OUT_DIR, "instagram-profile-banner-mockup.png")
    mock.save(mock_path, "PNG")
    return mock_path

if __name__ == "__main__":
    paths = build_panoramic_banner()
    print("Generated banner files:", paths)
