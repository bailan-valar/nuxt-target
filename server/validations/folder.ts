import { z } from 'zod'

/**
 * Folder类型验证 Schema
 */
export const folderTypeSchema = z.enum(['SCENE', 'GROUP', 'PROJECT', 'SUBPROJECT'], {
  errorMap: () => ({ message: '文件夹类型必须是 SCENE、GROUP、PROJECT 或 SUBPROJECT' })
})

/**
 * 颜色验证 Schema (十六进制颜色)
 */
export const colorSchema = z
  .string()
  .optional()
  .nullable()
  .transform((val) => {
    // 将undefined、null或空字符串都转换为null
    if (!val || val === '') {
      return null
    }
    return val
  })
  .refine((val) => val === null || /^#[0-9A-Fa-f]{6}$/.test(val), {
    message: '颜色格式必须是十六进制，如 #FFFFFF'
  })

/**
 * 基础Folder验证 Schema (不包含颜色验证，用于partial)
 */
export const folderBaseSchema = z.object({
  name: z
    .string()
    .min(1, '文件夹名称不能为空')
    .max(100, '文件夹名称不能超过100个字符'),
  type: folderTypeSchema,
  description: z
    .string()
    .max(500, '描述不能超过500个字符')
    .transform((val) => val === '' ? null : val)
    .nullable()
    .optional(),
  icon: z
    .string()
    .max(50, '图标名称不能超过50个字符')
    .transform((val) => val === '' ? null : val)
    .nullable()
    .optional(),
  color: z
    .string()
    .max(50, '颜色值不能超过50个字符')
    .transform((val) => val === '' ? null : val)
    .nullable()
    .optional(),
  sortOrder: z.number().int().min(0).optional()
})

/**
 * 父Folder验证 Schema
 */
export const parentFolderSchema = z.object({
  parentId: z.string().cuid().nullable().optional()
})

/**
 * 创建Folder验证 Schema (带颜色格式验证)
 */
export const createFolderSchema = folderBaseSchema
  .and(z.object({ color: colorSchema }))
  .and(parentFolderSchema)

/**
 * 更新Folder验证 Schema
 */
export const updateFolderSchema = folderBaseSchema.partial().and(parentFolderSchema)

/**
 * 移动Folder验证 Schema
 */
export const moveFolderSchema = z.object({
  newParentId: z.string().cuid().nullable(),
  newSortOrder: z.number().int().min(0).optional()
})

/**
 * Folder查询参数验证 Schema
 */
export const folderQuerySchema = z.object({
  type: folderTypeSchema.optional(),
  parentId: z.string().cuid().nullable().optional(),
  includeChildren: z.coerce.boolean().optional(),
  includeGoals: z.coerce.boolean().optional(),
  expandAll: z.coerce.boolean().optional()
})
