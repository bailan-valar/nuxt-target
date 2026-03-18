import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import type { Node } from '@tiptap/core'

export interface SlashCommandOptions {
  onStart?: (props: any) => void
  onUpdate?: (props: any) => void
  onExit?: (props: any) => void
  onKeyDown?: (props: any) => boolean
}

// 命令类型定义
export interface Command {
  id: string
  title: string
  description: string
  icon: any
  category: string
  command: ({ editor, range }: { editor: any; range: any }) => void
}

// 默认命令列表
export const defaultCommands: Command[] = [
  // 基础块
  {
    id: 'paragraph',
    title: '文本',
    description: '纯文本段落',
    icon: 'Paragraph',
    category: 'basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    }
  },
  {
    id: 'heading1',
    title: '一级标题',
    description: '大标题',
    icon: 'Heading1',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
    }
  },
  {
    id: 'heading2',
    title: '二级标题',
    description: '中标题',
    icon: 'Heading2',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
    }
  },
  {
    id: 'heading3',
    title: '三级标题',
    description: '小标题',
    icon: 'Heading3',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
    }
  },
  // 列表
  {
    id: 'taskList',
    title: '待办清单',
    description: '可勾选的待办事项',
    icon: 'TaskList',
    category: 'list',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    }
  },
  {
    id: 'bulletList',
    title: '无序列表',
    description: '简单的无序列表',
    icon: 'BulletList',
    category: 'list',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    }
  },
  {
    id: 'orderedList',
    title: '有序列表',
    description: '带序号的列表',
    icon: 'OrderedList',
    category: 'list',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    }
  },
  // 高级
  {
    id: 'blockquote',
    title: '引用',
    description: '引用块',
    icon: 'Blockquote',
    category: 'advanced',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    }
  },
  {
    id: 'codeBlock',
    title: '代码块',
    description: '代码片段',
    icon: 'CodeBlock',
    category: 'advanced',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    }
  },
  {
    id: 'horizontalRule',
    title: '分割线',
    description: '水平分割线',
    icon: 'HorizontalRule',
    category: 'advanced',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    }
  }
]

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      ...this.parent?.(),
      suggestion: {
        char: '/',
        commands: defaultCommands,
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        }
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ]
  }
})
