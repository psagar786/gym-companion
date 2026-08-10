#!/usr/bin/env python3
"""Build branded management PDFs from the Gym Companion Markdown sources."""

from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf"
LOGO = ROOT / "assets" / "fitness7-hero-logo.png"

CHARCOAL = colors.HexColor("#181818")
CARD = colors.HexColor("#252525")
ORANGE = colors.HexColor("#F45112")
OFF_WHITE = colors.HexColor("#F7F3EB")
MUTED = colors.HexColor("#6F6A65")
LIGHT = colors.HexColor("#F4F1EC")
LINE = colors.HexColor("#D8D2CA")


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def inline(text: str) -> str:
    text = esc(text.strip())
    text = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", text)
    text = re.sub(r"(https?://[^\s<]+)", r"<link href='\1' color='#F45112'>\1</link>", text)
    return text


def styles():
    base = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle(
            "CoverKicker", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=10, leading=13, textColor=ORANGE, alignment=TA_CENTER,
            spaceAfter=8, tracking=1.2,
        ),
        "cover_title": ParagraphStyle(
            "CoverTitle", parent=base["Title"], fontName="Helvetica-Bold",
            fontSize=29, leading=34, textColor=OFF_WHITE, alignment=TA_CENTER,
            spaceAfter=16,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle", parent=base["Normal"], fontName="Helvetica",
            fontSize=12, leading=18, textColor=colors.HexColor("#C9C3BB"),
            alignment=TA_CENTER, spaceAfter=9,
        ),
        "h1": ParagraphStyle(
            "H1", parent=base["Heading1"], fontName="Helvetica-Bold",
            fontSize=21, leading=26, textColor=CHARCOAL, spaceBefore=4,
            spaceAfter=11, keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "H2", parent=base["Heading2"], fontName="Helvetica-Bold",
            fontSize=15.5, leading=20, textColor=ORANGE, spaceBefore=13,
            spaceAfter=7, keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "H3", parent=base["Heading3"], fontName="Helvetica-Bold",
            fontSize=11.5, leading=15, textColor=CHARCOAL, spaceBefore=9,
            spaceAfter=4, keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body", parent=base["BodyText"], fontName="Helvetica",
            fontSize=9.3, leading=13.4, textColor=colors.HexColor("#312E2B"),
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "Bullet", parent=base["BodyText"], fontName="Helvetica",
            fontSize=9.1, leading=13, leftIndent=13, firstLineIndent=-8,
            bulletIndent=2, textColor=colors.HexColor("#312E2B"), spaceAfter=3,
        ),
        "quote": ParagraphStyle(
            "Quote", parent=base["BodyText"], fontName="Helvetica-Oblique",
            fontSize=11, leading=16, leftIndent=14, rightIndent=10,
            borderColor=ORANGE, borderWidth=2, borderPadding=9,
            textColor=colors.HexColor("#4A4642"), backColor=LIGHT,
            spaceBefore=5, spaceAfter=9,
        ),
        "small": ParagraphStyle(
            "Small", parent=base["BodyText"], fontName="Helvetica",
            fontSize=7.7, leading=10.5, textColor=MUTED,
        ),
        "table": ParagraphStyle(
            "Table", parent=base["BodyText"], fontName="Helvetica",
            fontSize=7.4, leading=9.5, textColor=colors.HexColor("#302D2A"),
        ),
        "table_head": ParagraphStyle(
            "TableHead", parent=base["BodyText"], fontName="Helvetica-Bold",
            fontSize=7.5, leading=9.5, textColor=OFF_WHITE,
        ),
        "cover_table": ParagraphStyle(
            "CoverTable", parent=base["BodyText"], fontName="Helvetica",
            fontSize=8.2, leading=11, textColor=OFF_WHITE,
        ),
    }


def parse_table(lines: list[str], st: dict, width: float):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append(cells)
    if not rows:
        return Spacer(1, 1)
    count = max(len(row) for row in rows)
    rows = [row + [""] * (count - len(row)) for row in rows]
    data = []
    for row_index, row in enumerate(rows):
        style = st["table_head"] if row_index == 0 else st["table"]
        data.append([Paragraph(inline(cell), style) for cell in row])
    weights = []
    for col in range(count):
        longest = max(len(row[col]) for row in rows)
        weights.append(max(1.0, min(3.6, longest / 16)))
    total = sum(weights)
    col_widths = [width * weight / total for weight in weights]
    table = Table(data, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), CHARCOAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), OFF_WHITE),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def markdown_flowables(markdown: str, st: dict, width: float):
    lines = markdown.splitlines()
    title = lines[0].lstrip("# ").strip()
    story = []
    index = 1
    paragraph = []

    def flush():
        nonlocal paragraph
        if paragraph:
            story.append(Paragraph(inline(" ".join(part.strip() for part in paragraph)), st["body"]))
            paragraph = []

    while index < len(lines):
        line = lines[index].rstrip()
        stripped = line.strip()
        if not stripped:
            flush()
            index += 1
            continue
        if stripped.startswith("|"):
            flush()
            table_lines = []
            while index < len(lines) and lines[index].strip().startswith("|"):
                table_lines.append(lines[index].strip())
                index += 1
            story.extend([parse_table(table_lines, st, width), Spacer(1, 7)])
            continue
        heading = re.match(r"^(#{1,3})\s+(.+)$", stripped)
        if heading:
            flush()
            level = len(heading.group(1))
            label = heading.group(2)
            if level == 1:
                story.extend([PageBreak(), Paragraph(inline(label), st["h1"])])
            else:
                story.append(Paragraph(inline(label), st[f"h{level}"]))
            index += 1
            continue
        if stripped.startswith("> "):
            flush()
            story.append(Paragraph(inline(stripped[2:]), st["quote"]))
            index += 1
            continue
        bullet = re.match(r"^-\s+(.+)$", stripped)
        ordered = re.match(r"^(\d+)\.\s+(.+)$", stripped)
        if bullet or ordered:
            flush()
            marker = "&#8226;" if bullet else f"{ordered.group(1)}."
            content = bullet.group(1) if bullet else ordered.group(2)
            story.append(Paragraph(f"{marker}&nbsp;&nbsp;{inline(content)}", st["bullet"]))
            index += 1
            continue
        paragraph.append(stripped)
        index += 1
    flush()
    return title, story


def build(source: Path, destination: Path, label: str, subtitle: str):
    st = styles()
    page_width, page_height = A4
    margin = 18 * mm
    body_width = page_width - 2 * margin
    title, content = markdown_flowables(source.read_text(encoding="utf-8"), st, body_width)
    doc = SimpleDocTemplate(
        str(destination), pagesize=A4, rightMargin=margin, leftMargin=margin,
        topMargin=20 * mm, bottomMargin=18 * mm, title=title,
        author="Sagar Paperwala - Fitness 7", subject=subtitle,
    )

    cover = [Spacer(1, 32 * mm)]
    if LOGO.exists():
        logo = Image(str(LOGO), width=66 * mm, height=22 * mm)
        logo.hAlign = "CENTER"
        cover.extend([logo, Spacer(1, 20 * mm)])
    cover.extend([
        Paragraph(label.upper(), st["cover_kicker"]),
        Paragraph(esc(title), st["cover_title"]),
        Paragraph(esc(subtitle), st["cover_subtitle"]),
        Spacer(1, 14 * mm),
        Table([
            [Paragraph("PRODUCT OWNER", st["table_head"]), Paragraph("STATUS", st["table_head"])],
            [Paragraph("Sagar Paperwala<br/>Product Manager - Fitness 7", st["cover_table"]),
             Paragraph("Management review<br/>Committed 50-member pilot", st["cover_table"])],
        ], colWidths=[74 * mm, 74 * mm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), ORANGE),
            ("BACKGROUND", (0, 1), (-1, -1), CARD),
            ("TEXTCOLOR", (0, 1), (-1, -1), OFF_WHITE),
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#55504B")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#55504B")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 9),
            ("RIGHTPADDING", (0, 0), (-1, -1), 9),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ])),
        Spacer(1, 13 * mm),
        Paragraph("Fitness 7 Gym Companion | 10 August 2026", st["cover_subtitle"]),
        PageBreak(),
    ])

    def decorate(canvas, document):
        canvas.saveState()
        if document.page == 1:
            canvas.setFillColor(CHARCOAL)
            canvas.rect(0, 0, page_width, page_height, fill=1, stroke=0)
            canvas.setFillColor(ORANGE)
            canvas.rect(0, page_height - 7 * mm, page_width, 7 * mm, fill=1, stroke=0)
        else:
            canvas.setStrokeColor(LINE)
            canvas.setLineWidth(0.5)
            canvas.line(margin, page_height - 12 * mm, page_width - margin, page_height - 12 * mm)
            canvas.setFont("Helvetica-Bold", 7.5)
            canvas.setFillColor(CHARCOAL)
            canvas.drawString(margin, page_height - 9 * mm, "FITNESS 7 GYM COMPANION")
            canvas.setFillColor(ORANGE)
            canvas.drawRightString(page_width - margin, page_height - 9 * mm, label.upper())
            canvas.setStrokeColor(LINE)
            canvas.line(margin, 12 * mm, page_width - margin, 12 * mm)
            canvas.setFont("Helvetica", 7.2)
            canvas.setFillColor(MUTED)
            canvas.drawString(margin, 8 * mm, "Management review | 10 August 2026")
            canvas.drawRightString(page_width - margin, 8 * mm, f"Page {document.page}")
        canvas.restoreState()

    doc.build(cover + content, onFirstPage=decorate, onLaterPages=decorate)


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    build(
        ROOT / "PRD.md",
        OUTPUT / "fitness7-gym-companion-prd.pdf",
        "Product Requirements Document",
        "V1-V4 product evolution, business case, pilot, requirements and rollout",
    )
    build(
        ROOT / "V5-V7-PRODUCT-SCOPE.md",
        OUTPUT / "fitness7-v5-v7-product-scope.pdf",
        "Product Scope and Roadmap",
        "Production personalization, anywhere training, goals and progress intelligence",
    )
    print(f"Created PDFs in {OUTPUT}")


if __name__ == "__main__":
    main()
