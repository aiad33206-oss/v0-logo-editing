import type { Metadata } from 'next'
import { Presentation } from '@/components/study/presentation'
import './print.css'

export const metadata: Metadata = {
  title: 'العرض التقديمي | فقه المعاملات',
  description:
    'عرض تقديمي بصري تفاعلي لمادة فقه المعاملات (خيار العيب، الربا، الرهن) مع إمكانية التحميل PDF.',
}

export default function PresentationPage() {
  return <Presentation />
}
