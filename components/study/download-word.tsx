'use client'

import { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'

export function DownloadWord() {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (loading) return
    setLoading(true)
    try {
      const { generateWordDoc } = await import('@/lib/generate-word')
      await generateWordDoc()
    } catch (err) {
      console.error('[v0] Word generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="no-print fixed bottom-20 left-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-body text-sm font-medium text-foreground shadow-lg transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
      aria-label="تحميل الملخص كملف Word"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <FileText className="size-4" aria-hidden="true" />
      )}
      {loading ? 'جارٍ التجهيز…' : 'تحميل Word'}
    </button>
  )
}
