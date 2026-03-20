<template>
  <div class="notion-editor">
    <!-- 斜杠命令菜单 -->
    <SlashCommand
      :is-visible="slashCommandVisible"
      :position="slashCommandPosition"
      :items="slashCommands"
      :query="slashQuery"
      @select="handleCommandSelect"
      @close="closeSlashCommand"
    />

    <!-- 浮动格式工具栏 -->
    <Teleport to="body">
      <div
        v-if="floatingToolbarVisible"
        class="floating-toolbar"
        :style="floatingToolbarStyle"
      >
        <div class="floating-toolbar-content">
          <button
            @click="toggleBold"
            :class="{ 'is-active': isActive('bold') }"
            class="floating-btn"
            title="粗体"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5h5.5a3.5 3.5 0 0 1 0 7h-5.5V5zm0 7h5.5a3.5 3.5 0 0 1 0 7H8v-7zM5 4a1 1 0 0 1 1-1h7.5a5.5 5.5 0 0 1 0 11h-1.5a5.5 5.5 0 0 1 0 11H6a1 1 0 0 1-1-1V4z"/>
            </svg>
          </button>

          <button
            @click="toggleItalic"
            :class="{ 'is-active': isActive('italic') }"
            class="floating-btn"
            title="斜体"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 20H7a1 1 0 0 1 0-2h.528a1 1 0 0 1 0-2H7a3 3 0 0 1 0-6h8a1 1 0 0 1 0 2h-.528a1 1 0 0 1 0 2H15a3 3 0 0 1 0 6z"/>
            </svg>
          </button>

          <button
            @click="toggleStrike"
            :class="{ 'is-active': isActive('strike') }"
            class="floating-btn"
            title="删除线"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4H9a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h6"/>
              <path d="M8 20h7a3 3 0 0 0 3-3v0a3 3 0 0 0-3-3H7"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
            </svg>
          </button>

          <button
            @click="toggleCode"
            :class="{ 'is-active': isActive('code') }"
            class="floating-btn"
            title="代码"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </button>

          <div class="toolbar-divider"></div>

          <button
            @click="openLinkDialog"
            :class="{ 'is-active': isActive('link') }"
            class="floating-btn"
            title="链接"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>

          <div class="toolbar-divider"></div>

          <button
            @click="toggleHeading(1)"
            :class="{ 'is-active': isActive('heading', { level: 1 }) }"
            class="floating-btn"
            title="标题1"
            type="button"
          >
            H1
          </button>

          <button
            @click="toggleHeading(2)"
            :class="{ 'is-active': isActive('heading', { level: 2 }) }"
            class="floating-btn"
            title="标题2"
            type="button"
          >
            H2
          </button>

          <button
            @click="toggleHeading(3)"
            :class="{ 'is-active': isActive('heading', { level: 3 }) }"
            class="floating-btn"
            title="标题3"
            type="button"
          >
            H3
          </button>

          <div class="toolbar-divider"></div>

          <button
            @click="toggleBulletList"
            :class="{ 'is-active': isActive('bulletList') }"
            class="floating-btn"
            title="无序列表"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="6" r="1.5"/>
              <circle cx="8" cy="12" r="1.5"/>
              <circle cx="8" cy="18" r="1.5"/>
              <path d="M11 6h10M11 12h10M11 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <button
            @click="toggleOrderedList"
            :class="{ 'is-active': isActive('orderedList') }"
            class="floating-btn"
            title="有序列表"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <text x="2" y="9" font-size="6" fill="currentColor" stroke="none">1</text>
              <line x1="8" y1="6" x2="21" y2="6"/>
              <text x="2" y="15" font-size="6" fill="currentColor" stroke="none">2</text>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <text x="2" y="21" font-size="6" fill="currentColor" stroke="none">3</text>
              <line x1="8" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <button
            @click="toggleTaskList"
            :class="{ 'is-active': isActive('taskList') }"
            class="floating-btn"
            title="待办清单"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </button>

          <button
            @click="toggleBlockquote"
            :class="{ 'is-active': isActive('blockquote') }"
            class="floating-btn"
            title="引用"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
          </button>

          <button
            @click="toggleCodeBlock"
            :class="{ 'is-active': isActive('codeBlock') }"
            class="floating-btn"
            title="代码块"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- 链接编辑对话框 -->
    <Teleport to="body">
      <div v-if="linkDialogVisible" class="link-dialog-overlay" @click.self="closeLinkDialog">
        <div class="link-dialog">
          <div class="link-dialog-header">
            <h3 class="link-dialog-title">
              {{ isEditingLink ? '编辑链接' : '插入链接' }}
            </h3>
            <button @click="closeLinkDialog" class="link-dialog-close" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="link-dialog-body">
            <div class="link-input-group">
              <label for="link-url" class="link-input-label">链接地址</label>
              <input
                id="link-url"
                v-model="linkUrl"
                type="url"
                class="link-input"
                placeholder="https://example.com"
                @keydown.enter="saveLink"
              />
            </div>
            <div class="link-input-group">
              <label for="link-text" class="link-input-label">显示文本</label>
              <input
                id="link-text"
                v-model="linkText"
                type="text"
                class="link-input"
                placeholder="链接显示文本"
                @keydown.enter="saveLink"
              />
            </div>
          </div>
          <div class="link-dialog-footer">
            <button
              v-if="isEditingLink"
              @click="removeLink"
              class="link-dialog-btn link-dialog-btn-danger"
              type="button"
            >
              删除链接
            </button>
            <div class="link-dialog-actions">
              <button
                @click="closeLinkDialog"
                class="link-dialog-btn link-dialog-btn-secondary"
                type="button"
              >
                取消
              </button>
              <button
                @click="saveLink"
                class="link-dialog-btn link-dialog-btn-primary"
                type="button"
                :disabled="!linkUrl"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 链接悬停工具条 -->
    <Teleport to="body">
      <div
        v-if="linkToolbarVisible"
        class="link-hover-toolbar"
        :style="{
          top: `${linkToolbarPosition.top}px`,
          left: `${linkToolbarPosition.left}px`
        }"
        @mouseenter="handleToolbarMouseEnter"
        @mouseleave="handleToolbarMouseLeave"
      >
        <div class="link-toolbar-content">
          <a
            v-if="linkToolbarUrl"
            :href="linkToolbarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="link-toolbar-btn"
            title="打开链接"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
          <button
            @click="editHoveredLink"
            class="link-toolbar-btn"
            title="编辑链接"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            @click="removeHoveredLink"
            class="link-toolbar-btn link-toolbar-btn-danger"
            title="删除链接"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- 编辑器内容区 -->
    <EditorContent
      :editor="editor"
      class="editor-content"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import { watch, onBeforeUnmount, onMounted, onUnmounted, ref, markRaw, nextTick, computed } from 'vue'
import SlashCommand from './editor/SlashCommand.vue'
import { defaultCommands } from '../lib/editor/slash-command'
import * as icons from './editor/icons'

interface Props {
  modelValue: string
  placeholder?: string
  editable?: boolean
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "输入 '/' 选择格式，或开始编写...",
  editable: true,
  minHeight: '400px'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 斜杠命令状态
const slashCommandVisible = ref(false)
const slashCommandPosition = ref({ top: 0, left: 0 })
const slashQuery = ref('')
const slashRange = ref<any>(null)

// 链接编辑状态
const linkDialogVisible = ref(false)
const linkUrl = ref('')
const linkText = ref('')
const isEditingLink = computed(() => editor.value?.isActive('link') || false)

// 链接悬停工具条状态
const linkToolbarVisible = ref(false)
const linkToolbarPosition = ref({ top: 0, left: 0 })
const linkToolbarUrl = ref('')
const hoveredLinkPos = ref<{ from: number; to: number } | null>(null)
let linkToolbarHideTimer: ReturnType<typeof setTimeout> | null = null

// 浮动工具栏状态
const floatingToolbarVisible = ref(false)
const floatingToolbarStyle = ref({ top: '0px', left: '0px' })
let floatingToolbarHideTimer: ReturnType<typeof setTimeout> | null = null

// 命令列表
const slashCommands = ref(
  defaultCommands.map(cmd => ({
    ...cmd,
    icon: markRaw((icons as any)[cmd.icon] || icons.Paragraph)
  }))
)

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
      link: {
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800'
        }
      }
    }),
    Placeholder.configure({
      emptyEditorClass: 'is-editor-empty',
      placeholder: props.placeholder
    }),
    TaskList,
    TaskItem.configure({
      nested: true
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-lg max-w-none focus:outline-none',
      style: `min-height: ${props.minHeight}`
    },
    handleKeyDown: (view, event) => {
      if (slashCommandVisible.value) {
        switch (event.key) {
          case 'Enter':
          case 'ArrowUp':
          case 'ArrowDown':
          case 'Escape':
            return true
        }
      }
      return false
    }
  },
  editable: props.editable,
  onUpdate: ({ editor }) => {
    const html = editor.isEmpty ? '' : editor.getHTML()
    emit('update:modelValue', html)
    linkToolbarVisible.value = false
  },
  onTransaction: ({ editor }) => {
    checkSlashCommand(editor)
    updateFloatingToolbar(editor)
  },
  onSelectionUpdate: ({ editor }) => {
    if (!editor.state.selection.empty) {
      closeSlashCommand()
    }
    linkToolbarVisible.value = false
    updateFloatingToolbar(editor)
  },
  onCreate: ({ editor }) => {
    if (!props.modelValue || props.modelValue.trim() === '') {
      editor.commands.setContent('<p></p>', false)
    }
  }
})

// 浮动工具栏
const updateFloatingToolbar = (editor: any) => {
  if (!editor || !editor.view) return

  const { from, to, empty } = editor.state.selection

  // 有文本选中时显示工具栏
  if (!empty && from !== to) {
    const coords = editor.view.coordsAtPos(from)
    const selection = window.getSelection()

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const rects = range.getClientRects()
      const firstRect = rects[0]

      if (firstRect) {
        const toolbarWidth = 600 // 估算工具栏宽度
        const toolbarHeight = 44

        let top = firstRect.top - toolbarHeight - 8
        let left = firstRect.left + (firstRect.width / 2) - (toolbarWidth / 2)

        // 边界检测
        const viewportWidth = window.innerWidth
        if (left + toolbarWidth > viewportWidth - 10) {
          left = viewportWidth - toolbarWidth - 10
        }
        if (left < 10) {
          left = 10
        }
        if (top < 10) {
          top = firstRect.bottom + 8
        }

        floatingToolbarStyle.value = {
          top: `${top}px`,
          left: `${left}px`
        }
        floatingToolbarVisible.value = true

        // 清除隐藏定时器
        if (floatingToolbarHideTimer) {
          clearTimeout(floatingToolbarHideTimer)
          floatingToolbarHideTimer = null
        }
        return
      }
    }
  }

  // 没有选中文本，延迟隐藏
  if (floatingToolbarHideTimer) {
    clearTimeout(floatingToolbarHideTimer)
  }
  floatingToolbarHideTimer = setTimeout(() => {
    floatingToolbarVisible.value = false
  }, 200)
}

// 格式化命令
const isActive = (name: string, attrs?: any) => {
  return editor.value?.isActive(name, attrs) || false
}

const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run()
}

const toggleStrike = () => {
  editor.value?.chain().focus().toggleStrike().run()
}

const toggleCode = () => {
  editor.value?.chain().focus().toggleCode().run()
}

const toggleHeading = (level: number) => {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

const toggleBulletList = () => {
  editor.value?.chain().focus().toggleBulletList().run()
}

const toggleOrderedList = () => {
  editor.value?.chain().focus().toggleOrderedList().run()
}

const toggleTaskList = () => {
  editor.value?.chain().focus().toggleTaskList().run()
}

const toggleBlockquote = () => {
  editor.value?.chain().focus().toggleBlockquote().run()
}

const toggleCodeBlock = () => {
  editor.value?.chain().focus().toggleCodeBlock().run()
}

// 斜杠命令
const checkSlashCommand = (editor: any) => {
  if (!editor || !editor.state || !editor.view) return

  try {
    const { state } = editor
    const { selection } = state
    const { $from } = selection

    const node = $from.parent
    if (!node || (node.type.name !== 'paragraph' && node.type.name !== 'heading' && node.type.name !== 'taskItem')) {
      closeSlashCommand()
      return
    }

    const text = node.textContent
    const pos = $from.parentOffset

    const lastSlashIndex = text.lastIndexOf('/', pos)

    if (lastSlashIndex === -1) {
      closeSlashCommand()
      return
    }

    const afterSlash = text.slice(lastSlashIndex + 1, pos)
    if (afterSlash.includes('\n')) {
      closeSlashCommand()
      return
    }

    slashQuery.value = afterSlash
    slashRange.value = {
      from: $from.start() + lastSlashIndex,
      to: $from.start() + pos
    }

    const coords = editor.view.coordsAtPos($from.start() + lastSlashIndex)
    slashCommandPosition.value = {
      top: coords.bottom + 8,
      left: coords.left
    }
    slashCommandVisible.value = true
  } catch (error) {
    console.warn('Failed to check slash command:', error)
    closeSlashCommand()
  }
}

const closeSlashCommand = () => {
  slashCommandVisible.value = false
  slashQuery.value = ''
  slashRange.value = null
}

const handleCommandSelect = (command: any) => {
  if (!editor.value || !slashRange.value || !editor.value.view || !editor.value.state) return

  try {
    const { from, to } = slashRange.value

    editor.value.view.dispatch(
      editor.value.state.tr.delete(from, to)
    )

    command.command({
      editor: editor.value,
      range: { from, to }
    })

    closeSlashCommand()
  } catch (error) {
    console.warn('Failed to execute command:', error)
    closeSlashCommand()
  }
}

// 链接操作
const openLinkDialog = () => {
  if (!editor.value) return

  if (editor.value.isActive('link')) {
    const currentLink = editor.value.getAttributes('link')
    linkUrl.value = currentLink.href || ''
    linkText.value = editor.value.state.doc.textBetween(
      editor.value.state.selection.from,
      editor.value.state.selection.to
    ) || ''
  } else {
    linkUrl.value = ''
    const selectedText = editor.value.state.doc.textBetween(
      editor.value.state.selection.from,
      editor.value.state.selection.to
    )
    linkText.value = selectedText || ''
  }

  linkDialogVisible.value = true
  floatingToolbarVisible.value = false
}

const closeLinkDialog = () => {
  linkDialogVisible.value = false
  linkUrl.value = ''
  linkText.value = ''
}

const saveLink = () => {
  if (!editor.value || !linkUrl.value) return

  const chain = editor.value.chain().focus()

  if (linkText.value) {
    const selectedText = editor.value.state.doc.textBetween(
      editor.value.state.selection.from,
      editor.value.state.selection.to
    )

    if (selectedText !== linkText.value) {
      if (editor.value.isActive('link')) {
        chain.unsetLink()

        if (selectedText !== linkText.value) {
          chain.insertContentAt(
            {
              from: editor.value.state.selection.from,
              to: editor.value.state.selection.to
            },
            linkText.value
          )
        }

        const from = editor.value.state.selection.from
        chain
          .setTextSelection({ from, to: from + linkText.value.length })
          .setLink({ href: linkUrl.value })
          .run()
      } else {
        chain
          .insertContent(linkText.value)
          .setLink({ href: linkUrl.value })
          .run()
      }

      closeLinkDialog()
      return
    }
  }

  chain.setLink({ href: linkUrl.value }).run()
  closeLinkDialog()
}

const removeLink = () => {
  if (!editor.value) return

  editor.value
    .chain()
    .focus()
    .unsetLink()
    .run()

  closeLinkDialog()
}

// 链接悬停工具条
const handleMousemove = (event: MouseEvent) => {
  if (!editor.value || !editor.value.view || !editor.value.state) return

  try {
    const target = event.target as HTMLElement
    const linkElement = target.closest('a')

    if (linkElement && editor.value.view.dom.contains(linkElement)) {
      if (linkToolbarHideTimer) {
        clearTimeout(linkToolbarHideTimer)
        linkToolbarHideTimer = null
      }

      const linkHref = linkElement.getAttribute('href')
      const rect = linkElement.getBoundingClientRect()

      const pos = editor.value.view.posAtDOM(linkElement, 0)
      if (pos === null) return

      const node = editor.value.state.doc.nodeAt(pos)
      if (!node) return

      const toolbarWidth = 170
      const toolbarHeight = 44

      let top = rect.bottom + 8
      let left = rect.left + (rect.width / 2) - (toolbarWidth / 2)

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left + toolbarWidth > viewportWidth - 10) {
        left = viewportWidth - toolbarWidth - 10
      }
      if (left < 10) {
        left = 10
      }
      if (top + toolbarHeight > viewportHeight - 10) {
        top = rect.top - toolbarHeight - 8
      }

      linkToolbarVisible.value = true
      linkToolbarUrl.value = linkHref || ''
      linkToolbarPosition.value = { top, left }
      hoveredLinkPos.value = {
        from: pos,
        to: pos + node.nodeSize
      }
    } else {
      if (linkToolbarHideTimer) {
        clearTimeout(linkToolbarHideTimer)
      }

      linkToolbarHideTimer = setTimeout(() => {
        linkToolbarVisible.value = false
        linkToolbarUrl.value = ''
        hoveredLinkPos.value = null
      }, 250)
    }
  } catch (error) {
    console.warn('Failed to handle mouse move:', error)
  }
}

const editHoveredLink = () => {
  if (!editor.value || !hoveredLinkPos.value) return

  editor.value
    .chain()
    .focus()
    .setTextSelection(hoveredLinkPos.value)
    .run()

  openLinkDialog()
  linkToolbarVisible.value = false
}

const removeHoveredLink = () => {
  if (!editor.value || !hoveredLinkPos.value) return

  editor.value
    .chain()
    .focus()
    .setTextSelection(hoveredLinkPos.value)
    .unsetLink()
    .run()

  linkToolbarVisible.value = false
  hoveredLinkPos.value = null
}

const handleToolbarMouseEnter = () => {
  if (linkToolbarHideTimer) {
    clearTimeout(linkToolbarHideTimer)
    linkToolbarHideTimer = null
  }
}

const handleToolbarMouseLeave = () => {
  if (linkToolbarHideTimer) {
    clearTimeout(linkToolbarHideTimer)
  }

  linkToolbarHideTimer = setTimeout(() => {
    linkToolbarVisible.value = false
    linkToolbarUrl.value = ''
    hoveredLinkPos.value = null
  }, 100)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue, oldValue) => {
  if (editor.value && newValue !== oldValue) {
    const currentHTML = editor.value.getHTML()
    if (newValue && newValue !== currentHTML) {
      editor.value.commands.setContent(newValue, false)
    } else if (!newValue && !editor.value.isEmpty) {
      editor.value.commands.clearContent()
    }
  }
})

watch(() => props.editable, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue)
  }
})

// 组件挂载
onMounted(() => {
  nextTick(() => {
    if (editor.value && editor.value.view && editor.value.view.dom) {
      editor.value.view.dom.addEventListener('mousemove', handleMousemove)
    }
  })
})

// 组件卸载
onUnmounted(() => {
  closeSlashCommand()

  try {
    if (editor.value && editor.value.view && editor.value.view.dom) {
      editor.value.view.dom.removeEventListener('mousemove', handleMousemove)
    }
  } catch (error) {
    console.warn('Failed to remove mousemove listener:', error)
  }

  if (linkToolbarHideTimer) {
    clearTimeout(linkToolbarHideTimer)
  }
  if (floatingToolbarHideTimer) {
    clearTimeout(floatingToolbarHideTimer)
  }
})

// 组件销毁
onBeforeUnmount(() => {
  try {
    if (editor.value && !editor.value.isDestroyed) {
      editor.value.destroy()
    }
  } catch (error) {
    console.warn('Failed to destroy editor:', error)
  }
})

defineExpose({
  editor
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notion-editor {
  @apply relative;
  z-index: 0;
}

/* 编辑器内容区 - 无边框 */
.editor-content {
  @apply bg-white;
  position: relative;
  z-index: 0;
}

.editor-content :deep(.ProseMirror) {
  @apply p-0 min-h-[400px];
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: #37352f;
  position: relative;
  z-index: 0;
}

.editor-content :deep(.ProseMirror:focus) {
  @apply outline-none;
}

/* 确保 ProseMirror 的所有子元素也在正确的层级 */
.editor-content :deep(.ProseMirror > *) {
  position: relative;
  z-index: 0;
}

/* Placeholder */
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  @apply text-gray-400 pointer-events-none float-left h-0;
}

/* 编辑器内容样式 */
.editor-content :deep(.ProseMirror h1) {
  @apply text-3xl font-bold mt-8 mb-4;
  color: #37352f;
  letter-spacing: -0.02em;
}

.editor-content :deep(.ProseMirror h2) {
  @apply text-2xl font-bold mt-7 mb-3;
  color: #37352f;
  letter-spacing: -0.01em;
}

.editor-content :deep(.ProseMirror h3) {
  @apply text-xl font-bold mt-6 mb-2;
  color: #37352f;
}

.editor-content :deep(.ProseMirror p) {
  @apply my-1;
}

/* 待办列表 */
.editor-content :deep(.ProseMirror ul[data-type="taskList"]) {
  @apply list-none pl-0 my-2;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li) {
  @apply flex items-start my-1 gap-2;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li > label) {
  @apply flex items-center justify-center flex-shrink-0 mt-1;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"]) {
  @apply w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li > div) {
  @apply flex-1 leading-relaxed;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li > div p) {
  @apply my-0 leading-relaxed;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div) {
  @apply text-gray-400 line-through;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li[data-checked="false"] > div) {
  @apply text-gray-900;
}

/* 普通列表 */
.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  @apply pl-6 my-2;
}

.editor-content :deep(.ProseMirror ul) {
  @apply list-disc;
}

.editor-content :deep(.ProseMirror ol) {
  @apply list-decimal;
}

.editor-content :deep(.ProseMirror li) {
  @apply my-1;
}

/* 引用 */
.editor-content :deep(.ProseMirror blockquote) {
  @apply border-l-4 border-gray-300 pl-4 my-2 text-gray-600;
}

/* 代码块 */
.editor-content :deep(.ProseMirror pre) {
  @apply bg-gray-100 rounded-lg p-4 my-3 font-mono text-sm overflow-x-auto;
}

.editor-content :deep(.ProseMirror code) {
  @apply bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-red-600;
}

.editor-content :deep(.ProseMirror pre code) {
  @apply bg-transparent p-0 text-gray-800;
}

/* 分割线 */
.editor-content :deep(.ProseMirror hr) {
  @apply border-gray-300 my-6;
}

/* 链接 */
.editor-content :deep(.ProseMirror a) {
  @apply text-blue-600 underline cursor-pointer;
}

/* 粗体、斜体等 */
.editor-content :deep(.ProseMirror strong) {
  @apply font-bold;
}

.editor-content :deep(.ProseMirror em) {
  @apply italic;
}

.editor-content :deep(.ProseMirror s) {
  @apply line-through;
}

/* 浮动工具栏 */
.floating-toolbar {
  @apply fixed z-[10000];
  animation: fade-in 0.15s ease-out;
}

.floating-toolbar-content {
  @apply flex items-center gap-0.5 bg-gray-900 rounded-lg shadow-lg px-1.5 py-1;
}

.floating-btn {
  @apply w-8 h-8 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-150 text-sm font-medium;
}

.floating-btn.is-active {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.toolbar-divider {
  @apply w-px h-6 bg-gray-700 mx-1;
}

/* 链接编辑对话框 */
.link-dialog-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001];
}

.link-dialog {
  @apply bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden;
}

.link-dialog-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200;
}

.link-dialog-title {
  @apply text-lg font-semibold text-gray-900;
}

.link-dialog-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors duration-150;
}

.link-dialog-body {
  @apply px-6 py-4 space-y-4;
}

.link-input-group {
  @apply space-y-2;
}

.link-input-label {
  @apply block text-sm font-medium text-gray-700;
}

.link-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.link-dialog-footer {
  @apply px-6 py-4 bg-gray-50 flex items-center justify-between gap-4;
}

.link-dialog-actions {
  @apply flex items-center gap-2 ml-auto;
}

.link-dialog-btn {
  @apply px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150;
}

.link-dialog-btn-secondary {
  @apply bg-white border border-gray-300 text-gray-700 hover:bg-gray-50;
}

.link-dialog-btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.link-dialog-btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

/* 链接悬停工具条 */
.link-hover-toolbar {
  @apply fixed z-[10001];
  animation: fade-in 0.15s ease-out;
}

.link-toolbar-content {
  @apply flex items-center gap-1 bg-gray-900 rounded-lg shadow-lg px-2 py-1.5;
}

.link-toolbar-btn {
  @apply w-8 h-8 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-150;
}

.link-toolbar-btn-danger {
  @apply hover:bg-red-600;
}
</style>
