import { Cover, TableOfContents } from '@/components/study/cover'
import { SectionAib } from '@/components/study/section-aib'
import { SectionRiba } from '@/components/study/section-riba'
import { SectionRahn } from '@/components/study/section-rahn'

export default function Page() {
  return (
    <main
      dir="rtl"
      className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 md:px-6 md:py-12"
    >
      <Cover />
      <TableOfContents />

      <div className="mt-10 space-y-12">
        <section id="aib" className="scroll-mt-6">
          <SectionAib />
        </section>

        <div aria-hidden="true" className="flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-border" />
          <span className="size-1.5 rounded-full bg-rose/60" />
          <span className="h-px w-16 bg-border" />
        </div>

        <section id="riba" className="scroll-mt-6">
          <SectionRiba />
        </section>

        <div aria-hidden="true" className="flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-border" />
          <span className="size-1.5 rounded-full bg-rose/60" />
          <span className="h-px w-16 bg-border" />
        </div>

        <section id="rahn" className="scroll-mt-6">
          <SectionRahn />
        </section>
      </div>

      <footer className="mt-14 rounded-2xl border border-border bg-card px-6 py-6 text-center font-body text-sm text-foreground/60">
        <p>ملخص دراسي للمراجعة والمذاكرة — نسأل الله التوفيق والسداد</p>
      </footer>
    </main>
  )
}
