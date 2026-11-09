import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Wabi-Sabi & Swiss Palette (from AGENTS.md)
CHARCOAL = (24, 23, 21)       # #181715 Deep Charcoal
CHARCOAL_SOFT = (38, 36, 33)  # #262421 Elevated Dark Surface
STONE = (244, 240, 234)       # #F4F0EA Warm Alabaster Stone
STONE_CARD = (250, 248, 244)  # #FAF8F4 Crisp Stone Card
CLAY = (217, 200, 184)        # #D9C8B8 Raw Clay
CLAY_DARK = (142, 130, 118)   # #8E8276 Muted Stone Text
TERRACOTTA = (200, 90, 50)    # #C85A32 Kiln Terracotta
TERRACOTTA_BG = (246, 226, 218)
SAGE = (106, 128, 108)        # #6A806C Organic Sage
SAGE_BG = (224, 233, 225)
BORDER_LIGHT = (222, 214, 203)
BORDER_DARK = (58, 55, 50)
WHITE = (255, 255, 255)

def get_font(size, bold=False, mono=False):
    win_fonts = r"C:\Windows\Fonts"
    candidates = []
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

def draw_rounded_rect(draw, xy, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def draw_pill(draw, x, y, text, font, fg, bg, pad_x=24, pad_y=12, outline=None):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    w = tw + pad_x * 2
    h = th + pad_y * 2
    draw.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=bg, outline=outline, width=2 if outline else 0)
    draw.text((x + pad_x, y + pad_y - bbox[1]), text, font=font, fill=fg)
    return w, h

# ==============================================================================
# CARD 1: LINKTREE VS QUALFI (1830 x 1658 for Canva Light Post 1)
# ==============================================================================
def make_card_1():
    W, H = 1830, 1658
    img = Image.new("RGB", (W, H), STONE)
    draw = ImageDraw.Draw(img)

    # Subtle Swiss architectural grid lines
    for gx in range(0, W, 183):
        draw.line([(gx, 0), (gx, H)], fill=(235, 230, 222), width=1)
    for gy in range(0, H, 183):
        draw.line([(0, gy), (W, gy)], fill=(235, 230, 222), width=1)

    f_mono_sm = get_font(28, bold=True, mono=True)
    f_mono_md = get_font(32, bold=True, mono=True)
    f_title = get_font(48, bold=True)
    f_sub = get_font(34, bold=False)
    f_bold = get_font(36, bold=True)
    f_big_num = get_font(86, bold=True)

    # Top header bar inside card
    draw_pill(draw, 70, 60, "BIO FUNNEL AUDIT // 2026 BENCHMARK", f_mono_sm, CHARCOAL, CLAY)
    draw.text((1380, 72), "QUALFI.IO", font=f_mono_md, fill=TERRACOTTA)

    # Left Column: THE OLD WAY (Static Bio Link / Linktree)
    col_y = 165
    col_h = 1320
    left_x1, left_x2 = 70, 885
    draw_rounded_rect(draw, (left_x1, col_y, left_x2, col_y + col_h), 32, fill=(236, 231, 223), outline=BORDER_LIGHT, width=3)

    draw_pill(draw, left_x1 + 48, col_y + 48, "[X]  THE DEAD BIO LINK", f_mono_sm, (130, 60, 50), TERRACOTTA_BG)
    draw.text((left_x1 + 48, col_y + 140), "Linktree + Google Form\n+ \"DM Me READY\"", font=f_title, fill=CHARCOAL)

    bad_items = [
        ("14% COMPLETION", "Prospects bounce when faced with a wall of text or a 15-field static intake form."),
        ("18-HOUR REPLY DELAY", "By the time you email or DM back, their peak buying motivation has vanished."),
        ("ZERO VALUE EXCHANGE", "Asking for name, phone & struggles upfront without giving them anything first."),
        ("UNVETTED TIRE-KICKERS", "You waste hours in DMs with people who have no budget or timeline.")
    ]
    iy = col_y + 310
    for head, desc in bad_items:
        draw_rounded_rect(draw, (left_x1 + 48, iy, left_x2 - 48, iy + 215), 20, fill=STONE, outline=BORDER_LIGHT, width=2)
        draw.text((left_x1 + 80, iy + 28), "—  " + head, font=f_bold, fill=(150, 75, 60))
        # wrap desc manually
        words = desc.split()
        lines, cur = [], ""
        for w in words:
            test = (cur + " " + w).strip()
            if draw.textlength(test, font=f_sub) < (left_x2 - left_x1 - 150):
                cur = test
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        for idx, ln in enumerate(lines[:3]):
            draw.text((left_x1 + 80, iy + 92 + idx * 42), ln, font=f_sub, fill=CLAY_DARK)
        iy += 240

    # Right Column: THE QUALFI WAY (Dark Charcoal Card)
    right_x1, right_x2 = 945, 1760
    draw_rounded_rect(draw, (right_x1, col_y, right_x2, col_y + col_h), 32, fill=CHARCOAL, outline=TERRACOTTA, width=4)

    draw_pill(draw, right_x1 + 48, col_y + 48, "●  QUALFI 60-SEC MICRO-TOOL", f_mono_sm, WHITE, TERRACOTTA)
    draw.text((right_x1 + 48, col_y + 140), "Interactive Macro &\nSplit Diagnostic", font=f_title, fill=STONE)

    good_items = [
        ("INSTANT VALUE EXCHANGE", "Calculates exact TDEE calories, macro grams & training split in 60 seconds."),
        ("ALGORITHMIC SCORE (0-100)", "Scores every lead on timeline, training frequency & urgency automatically."),
        ("< 2s WHATSAPP DISPATCH", "Encrypted webhook pings your WhatsApp while they are still looking at their phone."),
        ("3.8x HIGHER CONVERSION", "Replaces passive bio links with a tactile, sub-400ms diagnostic experience.")
    ]
    iy = col_y + 310
    for head, desc in good_items:
        draw_rounded_rect(draw, (right_x1 + 48, iy, right_x2 - 48, iy + 215), 20, fill=CHARCOAL_SOFT, outline=BORDER_DARK, width=2)
        draw.text((right_x1 + 80, iy + 28), "+  " + head, font=f_bold, fill=TERRACOTTA)
        words = desc.split()
        lines, cur = [], ""
        for w in words:
            test = (cur + " " + w).strip()
            if draw.textlength(test, font=f_sub) < (right_x2 - right_x1 - 150):
                cur = test
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        for idx, ln in enumerate(lines[:3]):
            draw.text((right_x1 + 80, iy + 92 + idx * 42), ln, font=f_sub, fill=CLAY)
        iy += 240

    # Bottom bar
    draw_rounded_rect(draw, (70, 1515, 1760, 1605), 20, fill=CHARCOAL_SOFT)
    draw.text((110, 1542), "STOP LOSING WARM TRAFFIC TO STATIC FORMS  •  DEPLOY YOUR DIAGNOSTIC IN 48 HRS", font=f_mono_sm, fill=STONE)

    path = os.path.join(OUT_DIR, "canva-card-1.png")
    img.save(path, "PNG")
    return path

# ==============================================================================
# CARD 2: WHATSAPP <2S LEAD PAYLOAD (1550 x 1478 for Canva Dark Post 2)
# ==============================================================================
def make_card_2():
    W, H = 1550, 1478
    img = Image.new("RGB", (W, H), STONE)
    draw = ImageDraw.Draw(img)

    f_mono_sm = get_font(26, bold=True, mono=True)
    f_mono_md = get_font(32, bold=True, mono=True)
    f_title = get_font(50, bold=True)
    f_bold = get_font(36, bold=True)
    f_reg = get_font(32, bold=False)
    f_score = get_font(96, bold=True)

    # Top status header
    draw_rounded_rect(draw, (56, 52, W - 56, 152), 24, fill=CHARCOAL)
    draw_pill(draw, 84, 76, "● WHATSAPP WEBHOOK DISPATCH", f_mono_sm, WHITE, TERRACOTTA, pad_x=22, pad_y=10)
    draw.text((1130, 86), "LATENCY: 1.4 SEC", font=f_mono_sm, fill=CLAY)

    # Main Notification Card
    draw_rounded_rect(draw, (56, 184, W - 56, 1290), 32, fill=STONE_CARD, outline=BORDER_LIGHT, width=3)

    # Score Banner inside card
    draw_rounded_rect(draw, (100, 228, W - 100, 450), 24, fill=CHARCOAL_SOFT)
    draw.text((145, 260), "ALGORITHMIC BUYER INTENT SCORE", font=f_mono_sm, fill=CLAY)
    draw.text((145, 315), "94 / 100", font=f_score, fill=TERRACOTTA)
    draw_pill(draw, 620, 330, "HIGH PRIORITY • READY THIS WEEK", f_mono_sm, CHARCOAL, CLAY, pad_x=28, pad_y=16)

    # Prospect Profile Grid
    rows = [
        ("PROSPECT", "Marcus Vance  •  29 yrs  •  84 kg (185 lbs)", "+44 7700 900412 (WhatsApp Verified)"),
        ("PRIMARY GOAL", "Metabolic Recomposition & Lean Mass", "Struggle: Plateaued for 6 months on generic split"),
        ("TRAINING AVAILABILITY", "4 Sessions / Week  ->  Upper / Lower Split", "Equipment: Full Commercial Gym Access"),
        ("UNLOCKED BLUEPRINT", "2,420 kcal/day  •  195g P  /  245g C  /  72g F", "Delivered instantly to prospect on screen")
    ]
    ry = 490
    for label, main_val, sub_val in rows:
        draw_rounded_rect(draw, (100, ry, W - 100, ry + 175), 20, fill=STONE, outline=BORDER_LIGHT, width=2)
        draw.text((136, ry + 22), label, font=f_mono_sm, fill=TERRACOTTA)
        draw.text((136, ry + 64), main_val, font=f_bold, fill=CHARCOAL)
        draw.text((136, ry + 116), sub_val, font=f_reg, fill=CLAY_DARK)
        ry += 195

    # Bottom Action Bar
    draw_rounded_rect(draw, (56, 1320, W - 56, 1426), 24, fill=TERRACOTTA)
    draw.text((115, 1356), ">>  TAP TO MESSAGE MARCUS WHILE HE IS STILL LOOKING AT HIS MACROS", font=f_mono_md, fill=WHITE)

    path = os.path.join(OUT_DIR, "canva-card-2.png")
    img.save(path, "PNG")
    return path

# ==============================================================================
# CARD 3: THE 60-SECOND HANDSHAKE FUNNEL (1830 x 1658 for Canva Light Post 3)
# ==============================================================================
def make_card_3():
    W, H = 1830, 1658
    img = Image.new("RGB", (W, H), CHARCOAL)
    draw = ImageDraw.Draw(img)

    f_mono_sm = get_font(28, bold=True, mono=True)
    f_num = get_font(68, bold=True, mono=True)
    f_title = get_font(44, bold=True)
    f_desc = get_font(33, bold=False)
    f_badge = get_font(26, bold=True, mono=True)

    # Top Header inside dark canvas
    draw.text((75, 60), "SYSTEM ARCHITECTURE // THE 4-STEP MICRO-TOOL FUNNEL ARC", font=f_mono_sm, fill=CLAY)
    draw_pill(draw, 1390, 48, "DOHERTY < 400MS", f_badge, WHITE, TERRACOTTA, pad_x=24, pad_y=12)

    # 2x2 Bento Grid for the 4 Steps
    steps = [
        ("01", "THE CURIOSITY HOOK", "BIO LINK TAP",
         "Replace your dead Linktree with a single high-curiosity diagnostic: 'Calculate Your Exact Macros & Optimal Split in 60 Seconds.'",
         "3.4x higher tap-through from Instagram & TikTok profile views.",
         STONE, CHARCOAL, TERRACOTTA),
        ("02", "TACTILE DIAGNOSTIC", "5 RAPID INPUTS (~45 SEC)",
         "Prospect taps through Goal (Fat Loss/Recomp), Bodyweight & Age, Training Days (2-6x/wk), Primary Struggle, and Commitment Timeline.",
         "Zero typing fatigue. Sub-400ms tactile transitions keep completion > 82%.",
         CHARCOAL_SOFT, STONE, CLAY),
        ("03", "THE VALUE GATE", "FRICTIONLESS HANDSHAKE",
         "To unlock their calibrated TDEE calories, exact macro grams, and custom workout split, they enter Name + WhatsApp number.",
         "Reciprocity principle: real personalized math exchanged for verified contact info.",
         CHARCOAL_SOFT, STONE, CLAY),
        ("04", "INSTANT DISPATCH", "< 2 SECOND WEBHOOK",
         "Prospect gets their blueprint on screen immediately. Simultaneously, Qualfi scores their intent (0-100) and pings your WhatsApp.",
         "You message only 80+ scored buyers at peak motivation.",
         TERRACOTTA, WHITE, STONE)
    ]

    coords = [
        (75, 150, 885, 845),
        (945, 150, 1755, 845),
        (75, 905, 885, 1600),
        (945, 905, 1755, 1600)
    ]

    for (num, title, tag, body, metric, bg, fg, accent), (x1, y1, x2, y2) in zip(steps, coords):
        draw_rounded_rect(draw, (x1, y1, x2, y2), 32, fill=bg, outline=BORDER_DARK if bg == CHARCOAL_SOFT else None, width=3)
        draw.text((x1 + 52, y1 + 44), num, font=f_num, fill=accent)
        draw_pill(draw, x1 + 190, y1 + 58, tag, f_badge, CHARCOAL if bg != STONE else WHITE, CLAY if bg != STONE else CHARCOAL, pad_x=20, pad_y=10)
        draw.text((x1 + 52, y1 + 155), title, font=f_title, fill=fg)

        # Wrap body
        words = body.split()
        lines, cur = [], ""
        for w in words:
            test = (cur + " " + w).strip()
            if draw.textlength(test, font=f_desc) < (x2 - x1 - 104):
                cur = test
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        for i, ln in enumerate(lines[:4]):
            draw.text((x1 + 52, y1 + 235 + i * 48), ln, font=f_desc, fill=fg if bg != CHARCOAL_SOFT else CLAY)

        # Bottom metric box inside bento cell
        m_bg = (232, 226, 216) if bg == STONE else (28, 27, 25)
        m_fg = CHARCOAL if bg == STONE else STONE
        draw_rounded_rect(draw, (x1 + 44, y2 - 175, x2 - 44, y2 - 44), 20, fill=m_bg)
        words_m = metric.split()
        lines_m, cur_m = [], ""
        for w in words_m:
            test = (cur_m + " " + w).strip()
            if draw.textlength(test, font=f_mono_sm) < (x2 - x1 - 140):
                cur_m = test
            else:
                lines_m.append(cur_m)
                cur_m = w
        if cur_m:
            lines_m.append(cur_m)
        for i, ln in enumerate(lines_m[:2]):
            draw.text((x1 + 72, y2 - 150 + i * 40), ln, font=f_mono_sm, fill=m_fg)

    path = os.path.join(OUT_DIR, "canva-card-3.png")
    img.save(path, "PNG")
    return path

# ==============================================================================
# CARD 4: THE LIVE MACRO & SPLIT DELIVERABLE UI (1550 x 1478 for Canva Dark Post 4)
# ==============================================================================
def make_card_4():
    W, H = 1550, 1478
    img = Image.new("RGB", (W, H), STONE)
    draw = ImageDraw.Draw(img)

    f_mono_sm = get_font(26, bold=True, mono=True)
    f_mono_md = get_font(32, bold=True, mono=True)
    f_huge = get_font(92, bold=True)
    f_title = get_font(44, bold=True)
    f_bold = get_font(36, bold=True)
    f_reg = get_font(30, bold=False)

    # Header bar
    draw_pill(draw, 64, 56, "PROSPECT VIEW // UNLOCKED IN 60 SECONDS", f_mono_sm, WHITE, CHARCOAL, pad_x=24, pad_y=12)
    draw.text((1120, 68), "QUALFI ENGINE v2.4", font=f_mono_sm, fill=TERRACOTTA)

    # Main Caloric Target Card
    draw_rounded_rect(draw, (64, 150, W - 64, 510), 32, fill=CHARCOAL)
    draw.text((116, 195), "CALIBRATED DAILY METABOLIC TARGET (TDEE -15%)", font=f_mono_sm, fill=CLAY)
    draw.text((116, 255), "2,340 KCAL", font=f_huge, fill=STONE)
    draw_pill(draw, 820, 275, "GOAL: LEAN RECOMPOSITION", f_mono_sm, WHITE, TERRACOTTA, pad_x=28, pad_y=16)
    draw.text((116, 415), "BMR & activity-adjusted for 82kg bodyweight @ 4x/week training frequency", font=f_reg, fill=CLAY_DARK)

    # 3 Macro Cards Row
    f_note = get_font(26, bold=False)
    macros = [
        ("PROTEIN TARGET", "185g", "32%  •  740 kcal", "2.2g/kg lean mass target", TERRACOTTA),
        ("CARBOHYDRATES", "235g", "40%  •  940 kcal", "Peri-workout glycogen fuel", SAGE),
        ("DIETARY FATS", "73g", "28%  •  660 kcal", "Hormonal baseline support", CHARCOAL)
    ]
    mw = (W - 128 - 48) // 3
    for idx, (m_name, m_val, m_pct, m_note, m_col) in enumerate(macros):
        mx = 64 + idx * (mw + 24)
        my = 545
        draw_rounded_rect(draw, (mx, my, mx + mw, my + 390), 28, fill=STONE_CARD, outline=BORDER_LIGHT, width=3)
        # Top accent bar
        draw_rounded_rect(draw, (mx + 36, my + 36, mx + mw - 36, my + 52), 8, fill=m_col)
        draw.text((mx + 36, my + 82), m_name, font=f_mono_sm, fill=CLAY_DARK)
        draw.text((mx + 36, my + 135), m_val, font=f_huge, fill=CHARCOAL)
        draw_pill(draw, mx + 36, my + 260, m_pct, f_mono_sm, WHITE if m_col != CHARCOAL else STONE, m_col, pad_x=18, pad_y=8)
        draw.text((mx + 36, my + 334), m_note, font=f_note, fill=CLAY_DARK)

    # Optimal Workout Split Prescription Card
    draw_rounded_rect(draw, (64, 970, W - 64, 1245), 28, fill=STONE_CARD, outline=TERRACOTTA, width=3)
    draw.text((110, 1005), "RECOMMENDED TRAINING ARCHITECTURE", font=f_mono_sm, fill=TERRACOTTA)
    draw.text((110, 1055), "4-Day Upper / Lower Hypertrophy Split", font=f_title, fill=CHARCOAL)
    draw.text((110, 1125), "MON: Upper Heavy  •  TUE: Lower Quad/Glute  •  THU: Upper Volume  •  SAT: Lower Posterior", font=f_reg, fill=CHARCOAL_SOFT)
    draw.text((110, 1178), " Matched to your 4-day availability & 6-month strength plateau profile.", font=f_mono_sm, fill=SAGE)

    # Coach Hidden Layer Footer
    draw_rounded_rect(draw, (64, 1280, W - 64, 1420), 24, fill=CHARCOAL_SOFT)
    draw.text((110, 1312), "WHAT HAPPENS BEHIND THE SCREEN IN < 2 SECONDS:", font=f_mono_sm, fill=TERRACOTTA)
    draw.text((110, 1358), "Prospect gets this blueprint  ->  You get their WhatsApp + 91/100 Buyer Score.", font=f_bold, fill=STONE)

    path = os.path.join(OUT_DIR, "canva-card-4.png")
    img.save(path, "PNG")
    return path

if __name__ == "__main__":
    p1 = make_card_1()
    p2 = make_card_2()
    p3 = make_card_3()
    p4 = make_card_4()
    print("Generated:", p1, p2, p3, p4)

# ==============================================================================
# FULL 1080x1350 STANDALONE INSTAGRAM POST RENDERS (LOCAL FOLDER)
# ==============================================================================
def make_full_posts():
    f_head_lg = get_font(78, bold=True)
    f_head_md = get_font(66, bold=True)
    f_tag = get_font(24, bold=True, mono=True)
    f_footer = get_font(28, bold=True)
    f_btn = get_font(26, bold=True)

    # 1. Full Post 1 (Light Editorial 1080x1350)
    p1 = Image.new("RGB", (1080, 1350), WHITE)
    d1 = ImageDraw.Draw(p1)
    d1.text((88, 72), "KILL YOUR\nLINKTREE.", font=f_head_lg, fill=CHARCOAL)
    c1 = Image.open(os.path.join(OUT_DIR, "canva-card-1.png")).resize((915, 829), Image.Resampling.LANCZOS)
    p1.paste(c1, (88, 340))
    d1.text((88, 1232), "QUALFI DIAGNOSTICS", font=f_footer, fill=CHARCOAL)
    draw_rounded_rect(d1, (742, 1217, 1002, 1286), 35, fill=CHARCOAL)
    d1.text((795, 1236), "60s Audit ->", font=f_btn, fill=STONE)
    p1.save(os.path.join(OUT_DIR, "post-1-kill-your-linktree.png"), "PNG")

    # 2. Full Post 2 (Dark Editorial 1080x1350)
    p2 = Image.new("RGB", (1080, 1350), CHARCOAL)
    d2 = ImageDraw.Draw(p2)
    d2.text((310, 125), "ALGORITHMIC LEAD SCORING • 0–100", font=f_tag, fill=CLAY)
    d2.text((155, 185), "STOP SAYING\n\"DM ME READY\"", font=f_head_lg, fill=STONE, align="center")
    c2 = Image.open(os.path.join(OUT_DIR, "canva-card-2.png")).resize((775, 739), Image.Resampling.LANCZOS)
    draw_rounded_rect(d2, (140, 445, 940, 1210), 16, fill=STONE, outline=CLAY, width=4)
    p2.paste(c2, (152, 458))
    p2.save(os.path.join(OUT_DIR, "post-2-stop-saying-dm-ready.png"), "PNG")

    # 3. Full Post 3 (Light Editorial 1080x1350)
    p3 = Image.new("RGB", (1080, 1350), WHITE)
    d3 = ImageDraw.Draw(p3)
    d3.text((88, 72), "THE 60-SECOND\nHANDSHAKE.", font=f_head_lg, fill=CHARCOAL)
    c3 = Image.open(os.path.join(OUT_DIR, "canva-card-3.png")).resize((915, 829), Image.Resampling.LANCZOS)
    p3.paste(c3, (88, 340))
    d3.text((88, 1232), "DOHERTY SPEED < 400MS", font=f_footer, fill=CHARCOAL)
    draw_rounded_rect(d3, (742, 1217, 1002, 1286), 35, fill=TERRACOTTA)
    d3.text((795, 1236), "Try Live ->", font=f_btn, fill=WHITE)
    p3.save(os.path.join(OUT_DIR, "post-3-the-60-sec-handshake.png"), "PNG")

    # 4. Full Post 4 (Dark Editorial 1080x1350)
    p4 = Image.new("RGB", (1080, 1350), CHARCOAL)
    d4 = ImageDraw.Draw(p4)
    d4.text((295, 125), "INSTANT VALUE EXCHANGE FOR COACHES", font=f_tag, fill=CLAY)
    d4.text((195, 185), "GIVE MACROS.\nGET BUYERS.", font=f_head_lg, fill=STONE, align="center")
    c4 = Image.open(os.path.join(OUT_DIR, "canva-card-4.png")).resize((775, 739), Image.Resampling.LANCZOS)
    draw_rounded_rect(d4, (140, 445, 940, 1210), 16, fill=STONE, outline=CLAY, width=4)
    p4.paste(c4, (152, 458))
    p4.save(os.path.join(OUT_DIR, "post-4-give-macros-get-buyers.png"), "PNG")
    print("Full 1080x1350 posts generated successfully.")

if __name__ == "__main__":
    make_full_posts()
