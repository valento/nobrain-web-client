import type { ContentItem } from './types'

export function chunkIntoBricks(items: ContentItem[]): ContentItem[][] {
  const bricks: ContentItem[][] = []
  let i = 0
  while (i < items.length) {
    const size = Math.floor(Math.random() * 3) + 1
    bricks.push(items.slice(i, i + size))
    i += size
  }
  return bricks
}