import type { TipTapContent } from '@/api/types'

export function emptyTipTapDoc(): TipTapContent {
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}

/** Нормализует ответ API к документу TipTap. */
export function normalizeTipTapContent(raw: TipTapContent | null | undefined): TipTapContent {
  if (raw && typeof raw === 'object' && raw.type === 'doc') {
    return raw
  }
  return emptyTipTapDoc()
}
