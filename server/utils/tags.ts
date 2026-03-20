import { z } from 'zod'

/**
 * 将数组序列化为 JSON 字符串用于存储
 */
export function serializeTags(tags: string[]): string {
  return JSON.stringify(tags)
}

/**
 * 将 JSON 字符串反序列化为数组
 */
export function deserializeTags(tags: string | null | undefined): string[] {
  if (!tags) return []
  try {
    const parsed = JSON.parse(tags)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * 验证标签数组的 Zod schema
 */
export const tagsSchema = z.array(z.string().min(1).max(50)).max(20)

/**
 * 清理和验证标签
 * - 去重
 * - 过滤空字符串
 * - 验证格式
 */
export function normalizeTags(tags: unknown): string[] {
  const result = tagsSchema.safeParse(tags)
  if (result.success) {
    // 去重并过滤空字符串
    return Array.from(new Set(result.data.filter(t => t.trim())))
  }
  return []
}

/**
 * 从 Note 对象数组中反序列化 tags 字段
 */
export function deserializeNotesTags<T extends { tags: string }>(notes: T[]): (T & { tags: string[] })[] {
  return notes.map(note => ({
    ...note,
    tags: deserializeTags(note.tags)
  }))
}

/**
 * 从单个 Note 对象中反序列化 tags 字段
 */
export function deserializeNoteTags<T extends { tags: string } | null>(note: T): T extends null ? null : (T & { tags: string[] }) {
  if (!note) return null as any
  return {
    ...note,
    tags: deserializeTags(note.tags)
  } as any
}
