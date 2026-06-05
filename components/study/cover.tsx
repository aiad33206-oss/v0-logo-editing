import { BookHeart, GraduationCap, Sparkles } from 'lucide-react'

export function Cover() {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-sm md:px-12 md:py-14">
      {/* زخرفة ناعمة في الخلفية */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-rose-soft/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-12 size-56 rounded-full bg-secondary/50 blur-3xl"
      />

      <div className="relative">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <BookHeart className="size-8" />
        </span>

        <p className="mb-2 flex items-center justify-center gap-1.5 font-body text-sm font-semibold tracking-wide text-rose">
          <Sparkles className="size-4" />
          ملخص أكاديمي مُيسّر
        </p>

        <h1 className="font-display text-4xl leading-tight text-primary text-balance md:text-6xl">
          فقه المعاملات
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-heading text-lg text-foreground/80 text-pretty md:text-xl">
          خِيار العَيب &nbsp;•&nbsp; الرِّبا &nbsp;•&nbsp; الرَّهن
        </p>

        <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-border bg-muted/50 px-5 py-3 font-body text-sm text-foreground/75 md:text-base">
          <GraduationCap className="size-5 shrink-0 text-primary" />
          <span>
            الفرقة الثانية – شريعة إسلامية | كلية الدراسات الإسلامية بنات
            (السادات)
          </span>
        </div>
      </div>
    </header>
  )
}

const navItems = [
  { href: '#aib', label: 'خِيار العَيب', n: '١' },
  { href: '#riba', label: 'الرِّبا', n: '٢' },
  { href: '#rahn', label: 'الرَّهن', n: '٣' },
]

export function TableOfContents() {
  return (
    <nav
      aria-label="فهرس الموضوعات"
      className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm transition-colors hover:border-rose hover:bg-rose-soft/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary font-heading text-lg font-bold text-secondary-foreground transition-colors group-hover:bg-rose group-hover:text-white">
            {item.n}
          </span>
          <span className="font-heading text-lg font-bold text-primary">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  )
}
