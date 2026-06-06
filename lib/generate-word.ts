'use client'

import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LevelFormat,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Tab,
  TabStopType,
  TextRun,
  WidthType,
  Table,
  TableCell,
  TableRow,
  convertInchesToTwip,
} from 'docx'
import {
  chapters,
  documentMeta,
  type Block,
  type Chapter,
  type Topic,
} from './study-content'

/* ----------------------------- Palette & sizing ----------------------------- */
const COLORS = {
  ink: '1F2A24',
  muted: '5B6B63',
  brand: '7A1F3D', // توتي
  brandSoft: 'F5E6EC',
  green: '1F6B4A',
  greenSoft: 'E7F2EC',
  gold: '8A6D1F',
  goldSoft: 'F6EFD9',
  blue: '1F4E6B',
  blueSoft: 'E4EEF4',
  line: 'D9C7CE',
  paper: 'FFFFFF',
  zebra: 'F7F4F0',
}

const FONT = 'Arial'
// docx font sizes are in half-points
const SZ = {
  body: 24, // 12pt
  small: 20,
  h1: 40,
  h2: 30,
  h3: 26,
  label: 22,
  coverTitle: 72,
  coverSub: 34,
}

/* ----------------------------- Small helpers ----------------------------- */

function run(text: string, opts: Partial<{ bold: boolean; color: string; size: number; italics: boolean }> = {}) {
  return new TextRun({
    text,
    rightToLeft: true,
    font: FONT,
    bold: opts.bold,
    italics: opts.italics,
    color: opts.color ?? COLORS.ink,
    size: opts.size ?? SZ.body,
  })
}

function para(
  children: TextRun[],
  opts: Partial<{
    spacingBefore: number
    spacingAfter: number
    align: (typeof AlignmentType)[keyof typeof AlignmentType]
    indentRight: number
    keepNext: boolean
  }> = {},
) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.align ?? AlignmentType.JUSTIFIED,
    keepNext: opts.keepNext,
    spacing: {
      before: opts.spacingBefore ?? 0,
      after: opts.spacingAfter ?? 120,
      line: 340,
      lineRule: 'auto',
    },
    indent: opts.indentRight ? { right: opts.indentRight } : undefined,
    children,
  })
}

/* A colored "card" rendered as a single-cell shaded table with a side accent. */
function card(
  accent: string,
  soft: string,
  children: Paragraph[],
): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: soft },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: soft },
      left: { style: BorderStyle.SINGLE, size: 2, color: soft },
      right: { style: BorderStyle.SINGLE, size: 24, color: accent },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: soft, color: 'auto' },
            margins: {
              top: 120,
              bottom: 120,
              left: 200,
              right: 200,
            },
            children,
          }),
        ],
      }),
    ],
  })
}

function spacer(size = 120) {
  return new Paragraph({ spacing: { after: size }, children: [] })
}

/* Heading for a labeled chip inside a card (e.g. "آية", "حديث"). */
function chip(label: string, color: string) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 60 },
    children: [run(label, { bold: true, color, size: SZ.label })],
  })
}

/* ----------------------------- Block renderers ----------------------------- */

function renderBlock(block: Block): (Paragraph | Table)[] {
  switch (block.type) {
    case 'defn':
      return [
        card(COLORS.brand, COLORS.brandSoft, [
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 0, line: 340, lineRule: 'auto' },
            children: [
              run(`${block.label}: `, { bold: true, color: COLORS.brand }),
              run(block.text),
            ],
          }),
        ]),
        spacer(),
      ]

    case 'p':
      return [para([run(block.text)])]

    case 'verse':
      return [
        card(COLORS.green, COLORS.greenSoft, [
          chip('آية', COLORS.green),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: block.source ? 60 : 0, line: 360, lineRule: 'auto' },
            children: [run(block.text, { bold: true, color: COLORS.green })],
          }),
          ...(block.source
            ? [
                new Paragraph({
                  bidirectional: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 0 },
                  children: [run(`[${block.source}]`, { color: COLORS.muted, size: SZ.small })],
                }),
              ]
            : []),
        ]),
        spacer(),
      ]

    case 'hadith':
      return [
        card(COLORS.gold, COLORS.goldSoft, [
          chip('حديث', COLORS.gold),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 0, line: 360, lineRule: 'auto' },
            children: [run(block.text, { bold: true, color: COLORS.gold })],
          }),
        ]),
        spacer(),
      ]

    case 'evidence': {
      const kids: Paragraph[] = []
      if (block.title) kids.push(chip(block.title, COLORS.blue))
      block.items.forEach((it) =>
        kids.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            bullet: { level: 0 },
            spacing: { after: 60, line: 340, lineRule: 'auto' },
            children: [run(it)],
          }),
        ),
      )
      return [card(COLORS.blue, COLORS.blueSoft, kids), spacer()]
    }

    case 'opinion': {
      const kids: Paragraph[] = [
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 60 },
          children: [
            run(`القول ${block.order}`, { bold: true, color: COLORS.brand, size: SZ.h3 }),
            run(`  —  ${block.holders}`, { color: COLORS.muted }),
          ],
        }),
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 60, line: 340, lineRule: 'auto' },
          children: [run('الحكم: ', { bold: true }), run(block.ruling)],
        }),
      ]
      if (block.evidence?.length) {
        kids.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 40 },
            children: [run('الأدلة:', { bold: true, color: COLORS.blue })],
          }),
        )
        block.evidence.forEach((e) =>
          kids.push(
            new Paragraph({
              bidirectional: true,
              alignment: AlignmentType.JUSTIFIED,
              bullet: { level: 0 },
              spacing: { after: 40, line: 340, lineRule: 'auto' },
              children: [run(e)],
            }),
          ),
        )
      }
      if (block.discussion) {
        kids.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 40, after: 0, line: 340, lineRule: 'auto' },
            children: [run('المناقشة: ', { bold: true, color: COLORS.gold }), run(block.discussion)],
          }),
        )
      }
      return [card(COLORS.brand, COLORS.zebra, kids), spacer()]
    }

    case 'mahall':
      return [
        para(
          [run('محل النزاع: ', { bold: true, color: COLORS.brand }), run(block.text)],
          { spacingAfter: 120 },
        ),
      ]

    case 'agreement':
      return [
        card(COLORS.green, COLORS.greenSoft, [
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 0, line: 340, lineRule: 'auto' },
            children: [run('موضع اتفاق: ', { bold: true, color: COLORS.green }), run(block.text)],
          }),
        ]),
        spacer(),
      ]

    case 'tarjih':
      return [
        card(COLORS.brand, COLORS.brandSoft, [
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 60, line: 340, lineRule: 'auto' },
            children: [run('الترجيح: ', { bold: true, color: COLORS.brand }), run(block.choice, { bold: true })],
          }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 0, line: 340, lineRule: 'auto' },
            children: [run('السبب: ', { bold: true }), run(block.reason)],
          }),
        ]),
        spacer(),
      ]

    case 'numbered': {
      const out: Paragraph[] = []
      block.items.forEach((it) => {
        out.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            numbering: { reference: 'study-numbers', level: 0 },
            spacing: { after: 40, line: 340, lineRule: 'auto' },
            children: [run(`${it.title}: `, { bold: true, color: COLORS.brand }), run(it.body)],
          }),
        )
      })
      return out
    }

    case 'fa2eda':
      return [
        card(COLORS.gold, COLORS.goldSoft, [
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 0, line: 340, lineRule: 'auto' },
            children: [run('فائدة: ', { bold: true, color: COLORS.gold }), run(block.text)],
          }),
        ]),
        spacer(),
      ]

    case 'keyideas': {
      const kids: Paragraph[] = [chip('أفكار مفتاحية', COLORS.brand)]
      block.items.forEach((it) =>
        kids.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            bullet: { level: 0 },
            spacing: { after: 50, line: 340, lineRule: 'auto' },
            children: [run(it)],
          }),
        ),
      )
      return [card(COLORS.brand, COLORS.brandSoft, kids), spacer()]
    }

    case 'box': {
      const inner: (Paragraph | Table)[] = []
      inner.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 80 },
          children: [run(block.title, { bold: true, color: COLORS.brand, size: SZ.h3 })],
        }),
      )
      block.blocks.forEach((b) => inner.push(...renderBlock(b)))
      return [
        card(COLORS.brand, COLORS.zebra, inner as Paragraph[]),
        spacer(),
      ]
    }

    case 'quizHeading':
      return [
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 160, after: 100 },
          children: [run(block.text, { bold: true, color: COLORS.blue, size: SZ.h3 })],
        }),
      ]

    case 'trueFalse': {
      const out: (Paragraph | Table)[] = []
      block.items.forEach((it, i) => {
        out.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 30, line: 340, lineRule: 'auto' },
            children: [run(`${i + 1}. `, { bold: true }), run(it.q)],
          }),
        )
        out.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: it.note ? 20 : 90 },
            indent: { right: 240 },
            children: [
              run('الإجابة: ', { bold: true, color: COLORS.muted, size: SZ.small }),
              run(it.answer ? 'صح' : 'خطأ', {
                bold: true,
                color: it.answer ? COLORS.green : COLORS.brand,
                size: SZ.small,
              }),
            ],
          }),
        )
        if (it.note)
          out.push(
            new Paragraph({
              bidirectional: true,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 90 },
              indent: { right: 240 },
              children: [run('التصويب: ', { bold: true, color: COLORS.gold, size: SZ.small }), run(it.note, { size: SZ.small })],
            }),
          )
      })
      return out
    }

    case 'mcq': {
      const out: (Paragraph | Table)[] = []
      block.items.forEach((it, i) => {
        out.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 30, line: 340, lineRule: 'auto' },
            children: [run(`${i + 1}. `, { bold: true }), run(it.q)],
          }),
        )
        it.options.forEach((op, oi) => {
          const correct = oi === it.correct
          out.push(
            new Paragraph({
              bidirectional: true,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 20 },
              indent: { right: 300 },
              children: [
                run(`${['أ', 'ب', 'ج', 'د', 'هـ'][oi] ?? oi + 1}) `, {
                  bold: true,
                  color: correct ? COLORS.green : COLORS.muted,
                }),
                run(op, { bold: correct, color: correct ? COLORS.green : COLORS.ink }),
                ...(correct ? [run('  ✓', { bold: true, color: COLORS.green })] : []),
              ],
            }),
          )
        })
        out.push(spacer(60))
      })
      return out
    }

    case 'essay': {
      const out: (Paragraph | Table)[] = []
      block.items.forEach((it, i) => {
        out.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 40, line: 340, lineRule: 'auto' },
            children: [run(`س${i + 1}: `, { bold: true, color: COLORS.brand }), run(it.q, { bold: true })],
          }),
        )
        out.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120, line: 340, lineRule: 'auto' },
            indent: { right: 240 },
            children: [run('ج: ', { bold: true, color: COLORS.green }), run(it.a)],
          }),
        )
      })
      return out
    }

    default:
      return []
  }
}

/* ----------------------------- Topic & chapter ----------------------------- */

function renderTopic(topic: Topic, idx: number): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = []
  out.push(
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      spacing: { before: 220, after: 120 },
      keepNext: true,
      border: {
        right: { style: BorderStyle.SINGLE, size: 18, color: COLORS.brand, space: 8 },
      },
      children: [run(`  ${topic.title}`, { bold: true, color: COLORS.ink, size: SZ.h2 })],
    }),
  )
  topic.blocks.forEach((b) => out.push(...renderBlock(b)))
  return out
}

function chapterDivider(chapter: Chapter): (Paragraph | Table)[] {
  return [
    new Paragraph({
      pageBreakBefore: true,
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 1400, after: 0 },
      children: [run(`الفصل ${chapter.number}`, { bold: true, color: COLORS.brand, size: SZ.coverSub })],
    }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 160 },
      children: [run(chapter.title, { bold: true, color: COLORS.ink, size: SZ.coverTitle })],
    }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 8, color: COLORS.line, space: 12 },
        bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.line, space: 12 },
      },
      children: [run(chapter.subtitle, { italics: true, color: COLORS.muted, size: SZ.h3 })],
    }),
  ]
}

/* ----------------------------- Cover ----------------------------- */

function coverPage(): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 1600, after: 0 }, children: [] }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [run('بسم الله الرحمن الرحيم', { color: COLORS.muted, size: SZ.h3 })],
    }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [run(documentMeta.title, { bold: true, color: COLORS.brand, size: SZ.coverTitle })],
    }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [run(documentMeta.subtitle, { bold: true, color: COLORS.ink, size: SZ.coverSub })],
    }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 60 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line, space: 14 },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.line, space: 14 },
      },
      children: [run(documentMeta.kind, { color: COLORS.muted, size: SZ.body })],
    }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 360, after: 0 },
      children: [run(documentMeta.affiliation, { color: COLORS.ink, size: SZ.body })],
    }),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200, after: 0 },
      children: [run(documentMeta.copyright, { color: COLORS.muted, size: SZ.small })],
    }),
  ]
}

/* ----------------------------- Build & download ----------------------------- */

export function buildStudyDoc() {
  const body: (Paragraph | Table)[] = []

  chapters.forEach((chapter) => {
    body.push(...chapterDivider(chapter))
    chapter.topics.forEach((topic, i) => body.push(...renderTopic(topic, i)))
  })

  return new Document({
    creator: 'Abdo Aiad',
    title: documentMeta.title,
    description: documentMeta.subtitle,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SZ.body, color: COLORS.ink },
          paragraph: { spacing: { line: 340, lineRule: 'auto' } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'study-numbers',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.RIGHT,
              style: { run: { bold: true, color: COLORS.brand } },
            },
          ],
        },
      ],
    },
    sections: [
      // Cover section (no header/footer page numbers)
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: coverPage(),
      },
      // Content section
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.9),
              bottom: convertInchesToTwip(0.9),
              left: convertInchesToTwip(0.85),
              right: convertInchesToTwip(0.85),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.line, space: 4 },
                },
                children: [
                  run(`${documentMeta.title} — ${documentMeta.subtitle}`, {
                    color: COLORS.muted,
                    size: SZ.small,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                border: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.line, space: 4 },
                },
                tabStops: [{ type: TabStopType.CENTER, position: 4500 }],
                children: [
                  run(documentMeta.footer, { color: COLORS.muted, size: SZ.small }),
                  new TextRun({ children: [new Tab()], font: FONT }),
                  new TextRun({
                    children: ['صفحة ', PageNumber.CURRENT],
                    font: FONT,
                    rightToLeft: true,
                    color: COLORS.muted,
                    size: SZ.small,
                  }),
                ],
              }),
            ],
          }),
        },
        children: body,
      },
    ],
  })
}

export async function generateWordDoc() {
  const doc = buildStudyDoc()
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'فقه-المعاملات-ملخص.docx'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
