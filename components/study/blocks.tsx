import type { ReactNode } from 'react'
import {
  BookOpen,
  Scale,
  Quote,
  Sparkles,
  CheckCircle2,
  XCircle,
  ListChecks,
  GitCompareArrows,
  Layers,
  Lightbulb,
  HelpCircle,
  PenLine,
  CircleDot,
} from 'lucide-react'

/* عنوان قسم رئيسي (كتاب) */
export function ChapterHeading({
  number,
  title,
  subtitle,
  icon,
}: {
  number: string
  title: string
  subtitle?: string
  icon?: ReactNode
}) {
  return (
    <div className="mb-8 mt-4 flex items-center gap-4 rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-md">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl font-bold">
        {icon ?? number}
      </div>
      <div>
        <h2 className="font-display text-3xl leading-tight md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-primary-foreground/85 md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/* عنوان مسألة / موضوع داخل القسم */
export function Topic({
  title,
  icon,
  children,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="note-card mb-6">
      <h3 className="mb-4 flex items-center gap-2.5 border-b border-border pb-3 font-heading text-2xl text-primary">
        <span className="text-rose">{icon ?? <Layers className="size-6" />}</span>
        <span>{title}</span>
      </h3>
      <div className="space-y-3 text-[1.08rem] leading-loose text-foreground">
        {children}
      </div>
    </section>
  )
}

/* فقرة عادية */
export function P({ children }: { children: ReactNode }) {
  return <p className="leading-loose">{children}</p>
}

/* تعريف لغة / اصطلاح */
export function Defn({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <p className="leading-loose">
      <span className="ml-1 inline-block rounded-lg bg-secondary px-2.5 py-0.5 font-heading font-semibold text-secondary-foreground">
        {label}
      </span>{' '}
      {children}
    </p>
  )
}

/* آية قرآنية */
export function Verse({
  children,
  source: marja,
}: {
  children: ReactNode
  source?: string
}) {
  return (
    <div className="verse-box my-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold opacity-80">
        <BookOpen className="size-4" />
        <span className="font-body">آية كريمة</span>
      </div>
      <p>{children}</p>
      {marja ? (
        <p className="mt-1.5 font-body text-sm opacity-70">{marja}</p>
      ) : null}
    </div>
  )
}

/* حديث شريف */
export function Hadith({ children }: { children: ReactNode }) {
  return (
    <div className="hadith-box my-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold opacity-80">
        <Quote className="size-4" />
        <span className="font-body">حديث شريف</span>
      </div>
      <p>{children}</p>
    </div>
  )
}

/* قائمة الأدلة العامة */
export function EvidenceList({
  title = 'الأدلة',
  items,
}: {
  title?: string
  items: ReactNode[]
}) {
  return (
    <div className="my-3 rounded-xl border border-border bg-muted/40 p-4">
      <p className="mb-2 flex items-center gap-1.5 font-heading font-semibold text-foreground">
        <ListChecks className="size-5 text-rose" /> {title}
      </p>
      <ol className="list-decimal space-y-1.5 pr-6 marker:font-bold marker:text-rose">
        {items.map((it, i) => (
          <li key={i} className="leading-loose">
            {it}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* بطاقة قول فقهي */
export function Opinion({
  order,
  holders,
  ruling,
  evidence,
  discussion,
}: {
  order: string
  holders: string
  ruling: ReactNode
  evidence?: ReactNode[]
  discussion?: ReactNode
}) {
  return (
    <div className="opinion-box my-3">
      <p className="mb-1 font-heading text-lg font-bold text-opinion">
        {order}
      </p>
      <p className="leading-loose">
        <span className="font-semibold">{ruling}</span>
      </p>
      <p className="mt-1.5 text-[0.98rem]">
        <span className="font-semibold text-opinion">القائلون به: </span>
        {holders}
      </p>
      {evidence && evidence.length > 0 ? (
        <div className="mt-2.5">
          <p className="mb-1 font-semibold text-opinion">الدليل ووجه الدلالة:</p>
          <ol className="list-decimal space-y-1 pr-6 marker:text-opinion">
            {evidence.map((e, i) => (
              <li key={i} className="leading-relaxed">
                {e}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {discussion ? (
        <p className="mt-2 rounded-lg bg-white/60 px-3 py-2 text-[0.97rem] leading-relaxed">
          <span className="font-semibold text-opinion">المناقشة: </span>
          {discussion}
        </p>
      ) : null}
    </div>
  )
}

/* محل النزاع */
export function Mahall({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 rounded-xl border-r-4 border-rose bg-rose-soft/60 px-4 py-3">
      <p className="leading-loose">
        <span className="ml-1 font-heading font-bold text-rose">
          محل النزاع:
        </span>
        {children}
      </p>
    </div>
  )
}

/* الاتفاق */
export function Agreement({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 flex gap-2 rounded-xl border border-verse/30 bg-verse-soft px-4 py-3">
      <CheckCircle2 className="mt-1 size-5 shrink-0 text-verse" />
      <p className="leading-loose">
        <span className="ml-1 font-heading font-bold text-verse">
          موضع الاتفاق:
        </span>
        {children}
      </p>
    </div>
  )
}

/* الترجيح */
export function Tarjih({
  choice,
  reason,
}: {
  choice: ReactNode
  reason: ReactNode
}) {
  return (
    <div className="tarjih-box my-3">
      <p className="mb-1 flex items-center gap-1.5 font-heading text-lg font-bold">
        <Sparkles className="size-5" /> الراجح
      </p>
      <p className="leading-loose">{choice}</p>
      <p className="mt-1.5 leading-loose">
        <span className="font-semibold">سبب الترجيح: </span>
        {reason}
      </p>
    </div>
  )
}

/* قائمة شروط / أركان مرقّمة بشكل بطاقات */
export function NumberedCards({
  items,
}: {
  items: { title: string; body: ReactNode }[]
}) {
  return (
    <div className="my-3 space-y-2.5">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3.5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-heading font-bold text-primary-foreground">
            {i + 1}
          </span>
          <div className="leading-loose">
            <span className="font-heading font-bold text-primary">
              {it.title}
            </span>
            {it.body ? <span> — {it.body}</span> : null}
          </div>
        </div>
      ))}
    </div>
  )
}

/* أهم الأفكار (خلاصة الدرس) */
export function KeyIdeas({ items }: { items: ReactNode[] }) {
  return (
    <div className="my-3 rounded-xl border border-verse/30 bg-verse-soft/70 p-4">
      <p className="mb-3 flex items-center gap-2 font-heading text-xl font-bold text-verse">
        <Lightbulb className="size-6" /> أهمّ الأفكار
      </p>
      <ol className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 leading-loose">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-verse/15 font-heading text-sm font-bold text-verse">
              {i + 1}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* عنوان كتلة الأنشطة التقييمية */
export function QuizHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 mt-2 flex items-center gap-2.5 border-b border-border pb-3 font-heading text-2xl text-rose">
      <HelpCircle className="size-6" />
      <span>{children}</span>
    </h3>
  )
}

/* أسئلة صح / خطأ مع الإجابة */
export function TrueFalse({
  items,
}: {
  items: { q: ReactNode; answer: boolean; note?: ReactNode }[]
}) {
  return (
    <div className="my-3 rounded-xl border border-border bg-muted/30 p-4">
      <p className="mb-3 font-heading font-bold text-primary">
        ضع علامة (صح) أو (خطأ) — مع التصحيح:
      </p>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li
            key={i}
            className="rounded-lg border border-border/70 bg-card px-3.5 py-2.5 leading-loose"
          >
            <div className="flex items-start gap-2">
              <span className="font-bold text-rose">{i + 1}.</span>
              <span className="flex-1">{it.q}</span>
              <span
                className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-sm font-bold ${
                  it.answer
                    ? 'bg-verse-soft text-verse'
                    : 'bg-rose-soft text-rose'
                }`}
              >
                {it.answer ? (
                  <>
                    <CheckCircle2 className="size-4" /> صح
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" /> خطأ
                  </>
                )}
              </span>
            </div>
            {it.note ? (
              <p className="mt-1.5 pr-5 text-[0.95rem] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  التصحيح:{' '}
                </span>
                {it.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* أسئلة الاختيار من متعدد مع تمييز الصحيح */
export function MultipleChoice({
  items,
}: {
  items: { q: ReactNode; options: string[]; correct: number }[]
}) {
  return (
    <div className="my-3 rounded-xl border border-border bg-muted/30 p-4">
      <p className="mb-3 font-heading font-bold text-primary">
        اختر الإجابة الصحيحة (المظلّلة هي الصحيحة):
      </p>
      <ol className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="leading-loose">
            <p className="mb-1.5">
              <span className="font-bold text-rose">{i + 1}.</span> {it.q}
            </p>
            <div className="flex flex-wrap gap-2 pr-5">
              {it.options.map((op, j) => (
                <span
                  key={j}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1 text-[0.97rem] ${
                    j === it.correct
                      ? 'bg-verse text-white font-semibold'
                      : 'border border-border bg-card text-muted-foreground'
                  }`}
                >
                  {j === it.correct ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <CircleDot className="size-3.5 opacity-50" />
                  )}
                  {op}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* أسئلة مقالية مع إجابة نموذجية مختصرة */
export function EssayQA({
  items,
}: {
  items: { q: ReactNode; a: ReactNode }[]
}) {
  return (
    <div className="my-3 space-y-3">
      <p className="flex items-center gap-2 font-heading font-bold text-primary">
        <PenLine className="size-5 text-rose" /> الأسئلة المقالية وإجاباتها
        المختصرة:
      </p>
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-xl border border-opinion/25 bg-opinion-soft/50 p-4"
        >
          <p className="mb-2 font-heading font-bold text-opinion">
            <span className="ml-1">س{i + 1}:</span>
            {it.q}
          </p>
          <p className="rounded-lg bg-card/70 px-3.5 py-2.5 leading-loose">
            <span className="font-semibold text-opinion">الإجابة: </span>
            {it.a}
          </p>
        </div>
      ))}
    </div>
  )
}

export const Icons = {
  Scale,
  GitCompareArrows,
  BookOpen,
  Layers,
}
