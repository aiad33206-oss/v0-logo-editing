'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Download,
  X,
  BookHeart,
  Sparkles,
  GraduationCap,
  Play,
} from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { aibMeta, aibSlides } from './section-aib'
import { ribaMeta, ribaSlides } from './section-riba'
import { rahnMeta, rahnSlides } from './section-rahn'
import type { ChapterMeta, DeckSlide } from './blocks'

type Accent = 'rose' | 'opinion' | 'verse'

const accentClasses: Record<
  Accent,
  { text: string; bg: string; soft: string; border: string; ring: string }
> = {
  rose: {
    text: 'text-rose',
    bg: 'bg-rose',
    soft: 'bg-rose-soft',
    border: 'border-rose',
    ring: 'ring-rose/30',
  },
  opinion: {
    text: 'text-opinion',
    bg: 'bg-opinion',
    soft: 'bg-opinion-soft',
    border: 'border-opinion',
    ring: 'ring-opinion/30',
  },
  verse: {
    text: 'text-verse',
    bg: 'bg-verse',
    soft: 'bg-verse-soft',
    border: 'border-verse',
    ring: 'ring-verse/30',
  },
}

type DeckItem =
  | { type: 'cover'; id: string }
  | { type: 'chapter'; id: string; meta: ChapterMeta; accent: Accent }
  | {
      type: 'content'
      id: string
      meta: ChapterMeta
      accent: Accent
      slide: DeckSlide
      step: number
      steps: number
    }
  | { type: 'end'; id: string }

const chapters: { meta: ChapterMeta; slides: DeckSlide[]; accent: Accent }[] = [
  { meta: aibMeta, slides: aibSlides, accent: 'rose' },
  { meta: ribaMeta, slides: ribaSlides, accent: 'opinion' },
  { meta: rahnMeta, slides: rahnSlides, accent: 'verse' },
]

function buildDeck(): DeckItem[] {
  const items: DeckItem[] = [{ type: 'cover', id: 'cover' }]
  for (const ch of chapters) {
    items.push({
      type: 'chapter',
      id: `chapter-${ch.meta.id}`,
      meta: ch.meta,
      accent: ch.accent,
    })
    ch.slides.forEach((slide, i) => {
      items.push({
        type: 'content',
        id: slide.id,
        meta: ch.meta,
        accent: ch.accent,
        slide,
        step: i + 1,
        steps: ch.slides.length,
      })
    })
  }
  items.push({ type: 'end', id: 'end' })
  return items
}

const deck = buildDeck()

/* ====== محتوى كل نوع شريحة (يُستخدم للعرض وللطباعة) ====== */

function CoverSlide() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
      <img
        src="/abdelrahman-mark.png"
        alt="شعار عبدالرحمن"
        className="pointer-events-none absolute left-2 top-2 h-12 w-auto opacity-90 md:h-16"
      />
      <img
        src="/azhar-mark.png"
        alt="شعار جامعة الأزهر"
        className="pointer-events-none absolute right-2 top-2 size-12 object-contain opacity-90 md:size-16"
      />
      <span className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
        <BookHeart className="size-10" />
      </span>
      <p className="mb-3 flex items-center justify-center gap-1.5 font-body text-base font-semibold tracking-wide text-rose">
        <Sparkles className="size-4" />
        ملخص أكاديمي مُيسّر — عرض تقديمي
      </p>
      <h1 className="font-display text-5xl leading-tight text-primary text-balance md:text-7xl">
        فقه المعاملات
      </h1>
      <p className="mt-5 font-heading text-xl text-foreground/80 md:text-2xl">
        خِيار العَيب &nbsp;•&nbsp; الرِّبا &nbsp;•&nbsp; الرَّهن
      </p>
      <div className="mt-8 flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-border bg-muted/50 px-5 py-3 font-body text-sm text-foreground/75 md:text-base">
        <GraduationCap className="size-5 shrink-0 text-primary" />
        <span>
          الفرقة الثانية – شريعة إسلامية | كلية الدراسات الإسلامية بنات (السادات)
        </span>
      </div>
    </div>
  )
}

function ChapterSlide({
  meta,
  accent,
}: {
  meta: ChapterMeta
  accent: Accent
}) {
  const a = accentClasses[accent]
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <span
        className={`mb-6 flex size-24 items-center justify-center rounded-3xl ${a.bg} text-primary-foreground shadow-lg`}
      >
        {meta.icon}
      </span>
      <p className={`mb-2 font-heading text-2xl font-bold ${a.text}`}>
        الفصل {meta.number}
      </p>
      <h2 className="font-display text-5xl leading-tight text-primary text-balance md:text-7xl">
        {meta.title}
      </h2>
      <p className="mt-5 max-w-2xl font-heading text-lg text-foreground/75 text-pretty md:text-xl">
        {meta.subtitle}
      </p>
    </div>
  )
}

function EndSlide() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <span className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
        <Sparkles className="size-10" />
      </span>
      <h2 className="font-display text-4xl leading-tight text-primary text-balance md:text-6xl">
        تمّ بحمد الله
      </h2>
      <p className="mt-4 font-heading text-lg text-foreground/75 md:text-xl">
        نسأل الله التوفيق والسداد
      </p>
      <p className="mt-8 rounded-full border border-border bg-card px-6 py-2 font-body text-sm text-foreground/70">
        جميع الحقوق محفوظة © Abdo Aiad
      </p>
    </div>
  )
}

function ContentHeader({
  meta,
  accent,
  label,
  step,
  steps,
}: {
  meta: ChapterMeta
  accent: Accent
  label: string
  step: number
  steps: number
}) {
  const a = accentClasses[accent]
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
      <span
        className={`inline-flex items-center gap-2 rounded-full ${a.soft} ${a.text} px-3 py-1 font-heading text-sm font-bold`}
      >
        <span className={`flex size-6 items-center justify-center rounded-full ${a.bg} text-xs text-primary-foreground`}>
          {meta.number}
        </span>
        {meta.title}
      </span>
      <span className="font-body text-xs text-muted-foreground">
        {label} — {step}/{steps}
      </span>
    </div>
  )
}

function renderBody(item: DeckItem): ReactNode {
  switch (item.type) {
    case 'cover':
      return <CoverSlide />
    case 'chapter':
      return <ChapterSlide meta={item.meta} accent={item.accent} />
    case 'end':
      return <EndSlide />
    case 'content':
      return (
        <div className="flex h-full flex-col">
          <ContentHeader
            meta={item.meta}
            accent={item.accent}
            label={item.slide.label}
            step={item.step}
            steps={item.steps}
          />
          <div className="deck-scroll flex-1 overflow-y-auto pe-1 text-[1.02rem]">
            {item.slide.node}
          </div>
        </div>
      )
  }
}

export function Presentation() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const total = deck.length

  const go = useCallback(
    (dir: number) => {
      setDirection(dir)
      setIndex((i) => Math.min(Math.max(i + dir, 0), total - 1))
    },
    [total],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Home') {
        setDirection(-1)
        setIndex(0)
      } else if (e.key === 'End') {
        setDirection(1)
        setIndex(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, total])

  const current = deck[index]
  const progress = ((index + 1) / total) * 100

  return (
    <>
      {/* واجهة العرض التفاعلية */}
      <div className="deck-ui fixed inset-0 z-40 flex flex-col bg-background" dir="rtl">
        {/* الشريط العلوي */}
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-2 font-heading font-bold text-primary">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookHeart className="size-4" />
            </span>
            <span className="hidden sm:inline">فقه المعاملات — عرض تقديمي</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-body text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">تحميل البرزنتيشن PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 font-body text-sm text-foreground/80 transition hover:bg-muted"
            >
              <X className="size-4" />
              <span className="hidden sm:inline">إغلاق</span>
            </Link>
          </div>
        </header>

        {/* المنصة */}
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-3 py-4 md:px-8 md:py-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? -70 : 70, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? 70 : -70, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full max-w-4xl"
            >
              <div
                className={`mx-auto flex h-full max-h-full flex-col rounded-3xl border bg-card p-5 shadow-xl ring-1 ring-border/40 md:p-8 ${
                  current.type === 'content'
                    ? accentClasses[current.accent].border
                    : 'border-border'
                }`}
                style={{ borderTopWidth: current.type === 'content' ? 4 : 1 }}
              >
                <motion.div
                  key={`${current.id}-inner`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.45, ease: 'easeOut' }}
                  className="h-full min-h-0"
                >
                  {renderBody(current)}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* الشريط السفلي */}
        <footer className="border-t border-border bg-card/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 font-body text-sm text-foreground/80 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-4" />
              السابق
            </button>
            <span className="font-body text-sm text-muted-foreground">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === total - 1}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 font-body text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              التالي
              <ArrowLeft className="size-4" />
            </button>
          </div>
        </footer>
      </div>

      {/* حاوية الطباعة: كل شريحة في صفحة مستقلة (مخفية على الشاشة) */}
      <div className="deck-print hidden" dir="rtl" aria-hidden="true">
        {deck.map((item) => (
          <div key={`print-${item.id}`} className="deck-print-page">
            {item.type === 'content' ? (
              renderBody(item)
            ) : (
              <div className="flex min-h-[70vh] flex-col justify-center">
                {renderBody(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

/* زر الدخول إلى العرض التقديمي داخل الموقع */
export function PresentationLauncher() {
  return (
    <Link
      href="/presentation"
      className="no-print fixed bottom-5 left-40 z-50 inline-flex items-center gap-2 rounded-full border border-rose bg-rose-soft px-5 py-3 font-body text-sm font-medium text-rose shadow-lg transition hover:bg-rose hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Play className="size-4" aria-hidden="true" />
      العرض التقديمي
    </Link>
  )
}
