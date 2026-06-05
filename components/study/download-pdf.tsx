'use client'

import { Download } from 'lucide-react'

export function DownloadPdf() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-body text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="تحميل الملخص كملف PDF"
    >
      <Download className="size-4" aria-hidden="true" />
      تحميل PDF
    </button>
  )
}
