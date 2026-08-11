#!/usr/bin/env python3
"""Build the Fitness 7 PRD executive visual pack."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "fitness7-prd-executive-visual-pack.pdf"
LOGO = ROOT / "assets" / "fitness7-hero-logo.png"
HERO = ROOT / "assets" / "exercises" / "pull-up.png"

W, H = landscape(A4)
CHARCOAL = colors.HexColor("#17191C")
PANEL = colors.HexColor("#24272B")
PANEL_2 = colors.HexColor("#30343A")
ORANGE = colors.HexColor("#F45112")
ORANGE_LIGHT = colors.HexColor("#FF7A3D")
CREAM = colors.HexColor("#F7F3EB")
MUTED = colors.HexColor("#A9A49C")
INK = colors.HexColor("#222222")
PAPER = colors.HexColor("#F3F0EA")
GREEN = colors.HexColor("#4FB477")
BLUE = colors.HexColor("#5FA8D3")
CORAL = colors.HexColor("#E9856E")
LINE = colors.HexColor("#D9D4CC")


def text(c, value, x, y, size=12, color=INK, font="Helvetica", max_width=None):
    c.setFillColor(color)
    c.setFont(font, size)
    if max_width is None:
        c.drawString(x, y, value)
        return
    words = value.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    leading = size * 1.35
    for index, line in enumerate(lines):
        c.drawString(x, y - index * leading, line)


def label(c, value, x, y, color=ORANGE):
    text(c, value.upper(), x, y, 8.5, color, "Helvetica-Bold")


def title(c, value, x=46, y=H - 78, size=30, color=INK):
    text(c, value, x, y, size, color, "Helvetica-Bold")


def footer(c, page, dark=False):
    color = colors.HexColor("#79746D") if not dark else colors.HexColor("#AAA49C")
    c.setStrokeColor(colors.HexColor("#44474C") if dark else LINE)
    c.setLineWidth(0.6)
    c.line(46, 31, W - 46, 31)
    text(c, "FITNESS 7 GYM COMPANION", 46, 17, 7.5, color, "Helvetica-Bold")
    text(c, "EXECUTIVE PRD VISUAL PACK", W - 198, 17, 7.5, color, "Helvetica-Bold")
    text(c, f"{page:02d}", W - 59, 17, 7.5, ORANGE, "Helvetica-Bold")


def rounded(c, x, y, w, h, fill, radius=12, stroke=None, width=1):
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(width)
        c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    else:
        c.roundRect(x, y, w, h, radius, fill=1, stroke=0)


def pill(c, value, x, y, w, fill=ORANGE, color=colors.white):
    rounded(c, x, y, w, 24, fill, 12)
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(x + w / 2, y + 8, value.upper())


def arrow(c, x1, y1, x2, y2, color=ORANGE, dotted=False):
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(2)
    c.setDash(4, 4) if dotted else c.setDash()
    c.line(x1, y1, x2, y2)
    c.setDash()
    c.line(x2, y2, x2 - 8, y2 + 5)
    c.line(x2, y2, x2 - 8, y2 - 5)


def node(c, value, x, y, w=120, h=48, fill=colors.white, accent=ORANGE, sub=None):
    rounded(c, x, y, w, h, fill, 9, colors.HexColor("#DED8D0"))
    c.setFillColor(accent)
    c.roundRect(x, y, 5, h, 3, fill=1, stroke=0)
    text(c, value, x + 14, y + h - 19, 9.5, INK, "Helvetica-Bold", w - 24)
    if sub:
        text(c, sub, x + 14, y + 10, 7, colors.HexColor("#77716A"), "Helvetica", w - 24)


def cover(c):
    c.setFillColor(CHARCOAL)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(ORANGE)
    c.circle(W - 22, H + 20, 180, fill=0, stroke=1)
    c.setLineWidth(42)
    c.circle(W - 30, H + 25, 150, fill=0, stroke=1)
    if LOGO.exists():
        c.drawImage(ImageReader(str(LOGO)), 47, H - 86, width=158, height=50, mask="auto", preserveAspectRatio=True)
    pill(c, "Management review", W - 181, H - 63, 134, PANEL_2, ORANGE_LIGHT)
    label(c, "Product requirements document", 48, H - 144)
    text(c, "A visual coach", 48, H - 206, 46, CREAM, "Helvetica-Bold")
    text(c, "for every member.", 48, H - 258, 46, CREAM, "Helvetica-Bold")
    text(c, "From workout-reference MVP to a dependable, personalized platform for 1,000 Fitness 7 members.", 50, H - 306, 14, colors.HexColor("#C7C2BA"), "Helvetica", 410)
    if HERO.exists():
        rounded(c, W - 285, 96, 235, 365, PANEL, 22)
        c.drawImage(ImageReader(str(HERO)), W - 265, 116, width=195, height=325, mask="auto", preserveAspectRatio=True, anchor="c")
    metrics = [("1,000", "ACTIVE MEMBERS"), ("2", "GYM LOCATIONS"), ("INR 60K", "ANNUAL COST AVOIDED")]
    x = 49
    for value, caption in metrics:
        rounded(c, x, 108, 142, 82, colors.HexColor("#202328"), 10)
        text(c, value, x + 15, 149, 25, CREAM, "Helvetica-Bold")
        text(c, caption, x + 15, 127, 7.2, MUTED, "Helvetica-Bold")
        x += 156
    text(c, "Sagar Paperwala  |  Product Manager - Fitness 7", 49, 68, 9, colors.HexColor("#AAA49C"), "Helvetica-Bold")
    text(c, "11 August 2026", 49, 51, 8, colors.HexColor("#6F6B65"))
    footer(c, 1, dark=True)
    c.showPage()


def problem(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, "01 / Problem and product promise", 46, H - 48)
    title(c, "Remove uncertainty from the gym floor")
    text(c, "The app succeeds when a member can start the right workout without opening YouTube, asking ChatGPT, or waiting for a trainer.", 47, H - 105, 12, colors.HexColor("#5E5953"), max_width=660)
    pain = [
        ("01", "No dependable routine", "Members improvise when the original app is unavailable."),
        ("02", "Exercise names are not enough", "Text-only lists still require external demonstrations."),
        ("03", "Equipment varies", "A missing machine can stop the session without an alternative."),
        ("04", "Repeated questions", "Trainers spend time re-explaining basic setup and form."),
    ]
    x, y = 46, H - 255
    for i, (number, heading, body) in enumerate(pain):
        if i == 2:
            x, y = 46, H - 420
        rounded(c, x, y, 350, 130, colors.white, 14)
        pill(c, number, x + 18, y + 88, 40, CHARCOAL, CREAM)
        text(c, heading, x + 76, y + 99, 15, INK, "Helvetica-Bold")
        text(c, body, x + 76, y + 74, 9.5, colors.HexColor("#6A655E"), max_width=248)
        x += 372
    rounded(c, 46, 78, W - 92, 78, CHARCOAL, 14)
    label(c, "Product promise", 68, 128, ORANGE_LIGHT)
    text(c, "Open. Understand. Train.", 68, 99, 18, CREAM, "Helvetica-Bold")
    text(c, "Fewer than two taps from the weekly home to the first exercise.", 320, 102, 10, MUTED)
    footer(c, 2)
    c.showPage()


def business(c):
    c.setFillColor(CHARCOAL)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, "02 / Business case", 46, H - 48, ORANGE_LIGHT)
    title(c, "Start with proven cost avoidance", color=CREAM)
    text(c, "Keep confirmed savings separate from future retention or revenue hypotheses.", 47, H - 108, 12, MUTED, max_width=650)
    cards = [
        ("INR 30K", "maintenance per gym", "Confirmed annual baseline"),
        ("2", "Fitness 7 locations", "Current business case"),
        ("INR 60K", "combined annual saving", "Gross cost avoidance"),
        ("50", "pilot members", "Committed first cohort"),
    ]
    x = 46
    for value, caption, note in cards:
        rounded(c, x, H - 292, 174, 142, PANEL, 14)
        text(c, value, x + 18, H - 210, 28, CREAM, "Helvetica-Bold")
        text(c, caption, x + 18, H - 237, 10, colors.white, "Helvetica-Bold")
        text(c, note, x + 18, H - 267, 8.5, MUTED, max_width=140)
        x += 190
    rounded(c, 46, 92, W - 92, 174, colors.HexColor("#202328"), 16, colors.HexColor("#3B3F45"))
    label(c, "Net operating value", 66, 232, ORANGE_LIGHT)
    text(c, "Gross maintenance avoided", 66, 198, 12, CREAM, "Helvetica-Bold")
    text(c, "minus", 270, 198, 11, MUTED, "Helvetica-Bold")
    text(c, "hosting + support + content + engineering", 332, 198, 12, CREAM, "Helvetica-Bold")
    c.setStrokeColor(ORANGE)
    c.setLineWidth(2)
    c.line(66, 176, W - 66, 176)
    text(c, "The PRD should not claim net savings until these operating costs are measured during the pilot.", 66, 142, 11, colors.HexColor("#C9C4BC"), max_width=670)
    footer(c, 3, dark=True)
    c.showPage()


def evolution(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, "03 / Product evolution", 46, H - 48)
    title(c, "Four releases turned a list into a companion")
    stages = [
        ("V1", "Visual routine MVP", "Daily split, alternatives, illustrations, local checks"),
        ("V2", "Guided workout", "Two-screen mobile flow, warm-up, recovery, history"),
        ("V3", "Account foundation", "Member and coach apps, roles, plans, Supabase"),
        ("V4", "Rich visual experience", "Ten slots, three-phase guidance, extras, rings"),
    ]
    base_y = 300
    c.setStrokeColor(colors.HexColor("#C9C3BB"))
    c.setLineWidth(4)
    c.line(95, base_y, W - 95, base_y)
    x_positions = [110, 310, 510, 710]
    for index, ((version, heading, body), x) in enumerate(zip(stages, x_positions)):
        c.setFillColor(ORANGE if index == 3 else CHARCOAL)
        c.circle(x, base_y, 24, fill=1, stroke=0)
        c.setFillColor(CREAM)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(x, base_y - 4, version)
        rounded(c, x - 82, base_y + 48, 164, 116, colors.white, 12)
        text(c, heading, x - 64, base_y + 126, 13, INK, "Helvetica-Bold", 130)
        text(c, body, x - 64, base_y + 91, 8.5, colors.HexColor("#6A655E"), max_width=130)
    rounded(c, 182, 75, 478, 92, CHARCOAL, 14)
    label(c, "Management interpretation", 204, 134, ORANGE_LIGHT)
    text(c, "V4 is the showcase. V3 is the technical foundation. V5 must prove pilot readiness before production scale.", 204, 107, 11, CREAM, "Helvetica-Bold", 430)
    footer(c, 4)
    c.showPage()


def functional(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, "04 / Functional architecture", 46, H - 48)
    title(c, "Three experiences, one operating loop")
    zones = [
        (46, colors.HexColor("#E7F2FA"), "MEMBER", ["Open today's plan", "Prepare", "Train + choose", "Recover", "See progress"]),
        (304, colors.HexColor("#FBECE4"), "COACH", ["Find member", "Manage membership", "Assign plan", "Preview", "Publish content"]),
        (562, colors.HexColor("#EEE8F7"), "OWNER + OPS", ["Approve governance", "Monitor pilot", "Review support", "Measure value", "Decide scale"]),
    ]
    for x, fill, heading, items in zones:
        rounded(c, x, 92, 234, 390, fill, 16)
        pill(c, heading, x + 18, 432, 116, CHARCOAL, CREAM)
        y = 374
        for i, item in enumerate(items):
            node(c, item, x + 18, y, 198, 45, colors.white, ORANGE if i in (0, 4) else colors.HexColor("#8E8982"))
            if i < len(items) - 1:
                arrow(c, x + 117, y - 2, x + 117, y - 19, colors.HexColor("#AFAAA3"))
            y -= 64
    arrow(c, 280, 284, 300, 284, ORANGE)
    arrow(c, 538, 284, 558, 284, ORANGE)
    footer(c, 5)
    c.showPage()


def technical(c):
    c.setFillColor(CHARCOAL)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, "05 / Current technical architecture", 46, H - 48, ORANGE_LIGHT)
    title(c, "Separate apps, shared secure backend", color=CREAM)
    text(c, "Member and coach interfaces remain isolated while Supabase enforces account and row-level access.", 47, H - 108, 11, MUTED, max_width=690)
    columns = [
        (46, "CLIENTS", ["Member browser", "Coach browser"]),
        (242, "VERCEL", ["Member V4", "Coach V3", "Admin API"]),
        (448, "SUPABASE", ["Auth", "Data API", "RLS"]),
        (654, "DATA", ["PostgreSQL", "Static assets"]),
    ]
    for x, heading, items in columns:
        label(c, heading, x, H - 160, ORANGE_LIGHT)
        y = H - 225
        for item in items:
            rounded(c, x, y, 150, 52, PANEL, 10, colors.HexColor("#41464D"))
            text(c, item, x + 15, y + 20, 10.5, CREAM, "Helvetica-Bold")
            y -= 78
    arrow(c, 196, H - 199, 238, H - 199, ORANGE)
    arrow(c, 392, H - 199, 444, H - 199, ORANGE)
    arrow(c, 598, H - 199, 650, H - 199, ORANGE)
    arrow(c, 392, H - 277, 444, H - 277, ORANGE)
    arrow(c, 392, H - 355, 444, H - 355, ORANGE)
    rounded(c, 46, 78, W - 92, 88, colors.HexColor("#202328"), 12)
    label(c, "Production additions required", 64, 135, ORANGE_LIGHT)
    text(c, "Monitoring  |  analytics  |  RLS tests  |  content approvals  |  backup and restore  |  offline cache  |  rate limits", 64, 105, 10, CREAM, "Helvetica-Bold")
    footer(c, 6, dark=True)
    c.showPage()


def agents(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, "06 / Agent and approval model", 46, H - 48)
    title(c, "Agents accelerate delivery; humans own decisions")
    rounded(c, 46, 350, W - 92, 90, CHARCOAL, 14)
    text(c, "PRODUCT MANAGER", 70, 399, 10, ORANGE_LIGHT, "Helvetica-Bold")
    text(c, "Coordinates scope, evidence, sequencing, and release gates", 70, 374, 15, CREAM, "Helvetica-Bold")
    agents_list = [
        ("Routine", "Programs + cues"),
        ("Visual", "Artwork + alt text"),
        ("Product/UI", "Mobile + access"),
        ("Platform", "Auth + release"),
        ("Docs", "PRD + runbooks"),
    ]
    x = 46
    for heading, sub in agents_list:
        rounded(c, x, 219, 139, 88, colors.white, 11)
        text(c, heading, x + 15, 270, 12, INK, "Helvetica-Bold")
        text(c, sub, x + 15, 244, 8.5, colors.HexColor("#6A655E"), max_width=108)
        arrow(c, x + 69, 347, x + 69, 312, colors.HexColor("#AAA49C"))
        x += 153
    approvers = [("Head trainer", 46), ("Gym operations", 238), ("Gym owner", 430), ("Platform owner", 622)]
    for heading, x in approvers:
        rounded(c, x, 92, 174, 72, colors.HexColor("#FBECE4"), 11)
        text(c, heading, x + 16, 126, 11, INK, "Helvetica-Bold")
        text(c, "Human approval", x + 16, 107, 8, colors.HexColor("#8A5B48"), "Helvetica-Bold")
    footer(c, 7)
    c.showPage()


def pilot(c):
    c.setFillColor(CHARCOAL)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, "07 / Decision and next 90 days", 46, H - 48, ORANGE_LIGHT)
    title(c, "Approve the pilot, not full production", color=CREAM)
    text(c, "Close trust and operational gaps first; scale only when the evidence supports it.", 47, H - 108, 12, MUTED, max_width=690)
    phases = [
        ("0-14 DAYS", "Trust + readiness", ["Content and brand approval", "Privacy and security evidence", "Instrumentation + baselines"]),
        ("15-45 DAYS", "50-member pilot", ["Two-location cohort", "Weekly safety and support review", "Observe first-workout friction"]),
        ("46-90 DAYS", "Evidence + scale", ["Fix critical findings", "Calculate net operating value", "Approve, revise, or stop"]),
    ]
    x = 46
    for period, heading, bullets in phases:
        rounded(c, x, 205, 235, 235, PANEL, 14, colors.HexColor("#41464D"))
        pill(c, period, x + 18, 390, 96, ORANGE, colors.white)
        text(c, heading, x + 18, 355, 17, CREAM, "Helvetica-Bold")
        y = 317
        for bullet in bullets:
            c.setFillColor(ORANGE_LIGHT)
            c.circle(x + 23, y + 3, 3, fill=1, stroke=0)
            text(c, bullet, x + 34, y, 9, colors.HexColor("#C9C4BC"), max_width=175)
            y -= 45
        x += 254
    rounded(c, 46, 87, W - 92, 76, CREAM, 12)
    text(c, "RECOMMENDATION", 65, 132, 8.5, ORANGE, "Helvetica-Bold")
    text(c, "Proceed with a controlled pilot. Do not position V4 as a production replacement yet.", 65, 106, 15, INK, "Helvetica-Bold")
    footer(c, 8, dark=True)
    c.showPage()


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Fitness 7 Gym Companion - Executive PRD Visual Pack")
    c.setAuthor("Sagar Paperwala - Fitness 7")
    c.setSubject("Management-ready visual summary of the Gym Companion PRD")
    cover(c)
    problem(c)
    business(c)
    evolution(c)
    functional(c)
    technical(c)
    agents(c)
    pilot(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    main()
