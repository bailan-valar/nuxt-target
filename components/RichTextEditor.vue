<template>
  <div
    class="rich-text-editor"
    :class="{ 'fullscreen': isFullscreen }"
  >
    <!-- 斜杠命令菜单 -->
    <SlashCommand
      :is-visible="slashCommandVisible"
      :position="slashCommandPosition"
      :items="slashCommands"
      :query="slashQuery"
      @select="handleCommandSelect"
      @close="closeSlashCommand"
    />

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

    <!-- 目录面板 (仅全屏模式显示) -->
    <div v-if="isFullscreen && tableOfContents.length > 0" class="table-of-contents">
      <div class="toc-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        <span>目录</span>
      </div>
      <div class="toc-list">
        <div
          v-for="(item, index) in tableOfContents"
          :key="index"
          class="toc-item"
          :class="[
            `toc-level-${item.level}`,
            { 'toc-active': activeHeadingIndex === index }
          ]"
          @click="scrollToHeading(item.id)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div v-if="editor" class="editor-toolbar">
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          class="toolbar-btn"
          title="粗体"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5h5.5a3.5 3.5 0 0 1 0 7h-5.5V5zm0 7h5.5a3.5 3.5 0 0 1 0 7H8v-7zM5 4a1 1 0 0 1 1-1h7.5a5.5 5.5 0 0 1 0 11h-1.5a5.5 5.5 0 0 1 0 11H6a1 1 0 0 1-1-1V4z"/>
          </svg>
        </button>

        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          class="toolbar-btn"
          title="斜体"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 20H7a1 1 0 0 1 0-2h.528a1 1 0 0 1 0-2H7a3 3 0 0 1 0-6h8a1 1 0 0 1 0 2h-.528a1 1 0 0 1 0 2H15a3 3 0 0 1 0 6z"/>
          </svg>
        </button>

        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          class="toolbar-btn"
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
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
          class="toolbar-btn"
          title="行内代码"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          @click="openLinkDialog"
          :class="{ 'is-active': editor.isActive('link') }"
          class="toolbar-btn"
          title="插入/编辑链接"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider" v-if="isFullscreen"></div>

      <div class="toolbar-group" v-if="isFullscreen">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          class="toolbar-btn"
          title="标题1"
          type="button"
        >
          H1
        </button>

        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          class="toolbar-btn"
          title="标题2"
          type="button"
        >
          H2
        </button>

        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          class="toolbar-btn"
          title="标题3"
          type="button"
        >
          H3
        </button>
      </div>

      <div class="toolbar-divider" v-if="isFullscreen"></div>

      <div class="toolbar-group" v-if="isFullscreen">
        <button
          @click="editor.chain().focus().toggleTaskList().run()"
          :class="{ 'is-active': editor.isActive('taskList') }"
          class="toolbar-btn"
          title="待办清单"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </button>

        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          class="toolbar-btn"
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
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          class="toolbar-btn"
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
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          class="toolbar-btn"
          title="引用"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
          </svg>
        </button>

        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          class="toolbar-btn"
          title="代码块"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          v-if="isFullscreen"
          @click="editor.chain().focus().setHorizontalRule().run()"
          class="toolbar-btn"
          title="分割线"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
          </svg>
        </button>

        <button
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          class="toolbar-btn"
          title="撤销"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
          </svg>
        </button>

        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          class="toolbar-btn"
          title="重做"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7v6h-6"/>
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          @click="toggleFullscreen"
          class="toolbar-btn fullscreen-btn"
          :title="isFullscreen ? '退出全屏' : '全屏编辑'"
          type="button"
        >
          <svg v-if="!isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 编辑器内容区 -->
    <EditorContent
      :editor="editor"
      class="editor-content"
    />

    <!-- 字数统计 -->
    <div v-if="editor && showCharCount" class="editor-footer">
      <span class="char-count">{{ editor.getText().length }} 字符</span>
    </div>
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
  showCharCount?: boolean
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容，输入 / 可选择格式...',
  editable: true,
  showCharCount: false,
  minHeight: '100px'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 全屏状态
const isFullscreen = ref(false)

// 目录相关
const activeHeadingIndex = ref(0)
const headingIds = ref<Map<string, number>>(new Map())

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

// 命令列表（带图标组件）
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
      }
    }),
    Placeholder.configure({
      emptyEditorClass: 'is-editor-empty',
      placeholder: props.placeholder
    }),
    TaskList,
    TaskItem.configure({
      nested: true
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline cursor-pointer hover:text-blue-800'
      }
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px]',
      style: `min-height: ${props.minHeight}`,
      'data-placeholder': props.placeholder
    },
    handleKeyDown: (view, event) => {
      // 斜杠命令菜单打开时，拦截特定按键
      if (slashCommandVisible.value) {
        switch (event.key) {
          case 'Enter':
          case 'ArrowUp':
          case 'ArrowDown':
          case 'Escape':
            // 让 SlashCommand 组件处理这些按键
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
    // 更新目录
    if (isFullscreen.value) {
      updateTableOfContents()
    }
  },
  onTransaction: ({ editor }) => {
    // 在每次事务（包括第一次输入）时检查斜杠命令
    checkSlashCommand(editor)
  },
  onSelectionUpdate: ({ editor }) => {
    // 选择变化时关闭斜杠命令
    if (!editor.state.selection.empty) {
      closeSlashCommand()
    }
  },
  onCreate: ({ editor }) => {
    // 确保空编辑器有正确的初始状态
    if (!props.modelValue || props.modelValue.trim() === '') {
      // 设置一个空段落，确保编辑器处于正确状态
      // 这样第一次输入才能正确触发 onUpdate
      editor.commands.setContent('<p></p>', false)
    }
  }
})

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value

  // 全屏时禁止body滚动并聚焦编辑器
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
    // 使用 nextTick 确保 DOM 更新后再聚焦
    nextTick(() => {
      editor.value?.chain().focus().run()
      updateTableOfContents()
      setupScrollListener()
    })
  } else {
    document.body.style.overflow = ''
    removeScrollListener()
  }
}

// 生成目录
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([])

const updateTableOfContents = () => {
  if (!editor.value) return

  const headings: Array<{ id: string; text: string; level: number }> = []
  const doc = editor.value.state.doc

  let headingIndex = 0
  doc.descendants((node: any, pos: number) => {
    if (node.type.name === 'heading') {
      const level = node.attrs.level
      const text = node.textContent
      const id = `heading-${headingIndex++}`

      // 存储标题位置用于滚动定位
      headingIds.value.set(id, pos)

      headings.push({ id, text, level })
    }
  })

  tableOfContents.value = headings
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  if (!editor.value) return

  const pos = headingIds.value.get(id)
  if (pos === undefined) return

  // 使用 Tiptap 的滚动到位置功能
  const view = editor.value.view
  const coords = view.coordsAtPos(pos)

  // 获取编辑器容器
  const editorElement = view.dom.closest('.editor-content')
  if (!editorElement) return

  // 计算滚动位置
  const scrollTop = coords.top - editorElement.getBoundingClientRect().top - 100

  editorElement.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  })
}

// 监听滚动更新活动标题
let scrollListener: (() => void) | null = null

const setupScrollListener = () => {
  const editorElement = editor.value?.view.dom.closest('.editor-content')
  if (!editorElement) return

  scrollListener = () => {
    if (!editor.value) return

    const containerRect = editorElement.getBoundingClientRect()
    const containerTop = containerRect.top + 150 // 偏移量，用于确定活动标题

    let activeIndex = 0
    let minDistance = Infinity

    tableOfContents.value.forEach((item, index) => {
      const pos = headingIds.value.get(item.id)
      if (pos === undefined) return

      const coords = editor.value!.view.coordsAtPos(pos)
      const distance = Math.abs(coords.top - containerTop)

      if (distance < minDistance) {
        minDistance = distance
        activeIndex = index
      }
    })

    activeHeadingIndex.value = activeIndex
  }

  editorElement.addEventListener('scroll', scrollListener)
}

const removeScrollListener = () => {
  if (scrollListener) {
    const editorElement = editor.value?.view.dom.closest('.editor-content')
    if (editorElement) {
      editorElement.removeEventListener('scroll', scrollListener)
    }
    scrollListener = null
  }
}

// 监听编辑器内容变化更新目录
watch(() => [editor.value, isFullscreen.value], () => {
  if (editor.value && isFullscreen.value) {
    updateTableOfContents()
  }
}, { deep: true })

// 检查斜杠命令触发
const checkSlashCommand = (editor: any) => {
  const { state } = editor
  const { selection } = state
  const { $from } = selection

  // 检查是否在段落、标题或列表项中
  const node = $from.parent
  if (!node || (node.type.name !== 'paragraph' && node.type.name !== 'heading' && node.type.name !== 'taskItem')) {
    closeSlashCommand()
    return
  }

  // 获取当前行的文本
  const text = node.textContent
  const pos = $from.parentOffset

  // 查找最后一个斜杠
  const lastSlashIndex = text.lastIndexOf('/', pos)

  if (lastSlashIndex === -1) {
    closeSlashCommand()
    return
  }

  // 检查斜杠后是否只有空格
  const afterSlash = text.slice(lastSlashIndex + 1, pos)
  if (afterSlash.includes('\n')) {
    closeSlashCommand()
    return
  }

  // 显示斜杠命令
  slashQuery.value = afterSlash
  slashRange.value = {
    from: $from.start() + lastSlashIndex,
    to: $from.start() + pos
  }

  // 计算菜单位置
  const coords = editor.view.coordsAtPos($from.start() + lastSlashIndex)
  slashCommandPosition.value = {
    top: coords.bottom + 8,
    left: coords.left
  }
  slashCommandVisible.value = true
}

// 关闭斜杠命令
const closeSlashCommand = () => {
  slashCommandVisible.value = false
  slashQuery.value = ''
  slashRange.value = null
}

// 打开链接编辑对话框
const openLinkDialog = () => {
  if (!editor.value) return

  if (editor.value.isActive('link')) {
    // 编辑现有链接
    const currentLink = editor.value.getAttributes('link')
    linkUrl.value = currentLink.href || ''
    linkText.value = editor.value.state.doc.textBetween(
      editor.value.state.selection.from,
      editor.value.state.selection.to
    ) || ''
  } else {
    // 新建链接
    linkUrl.value = ''
    const selectedText = editor.value.state.doc.textBetween(
      editor.value.state.selection.from,
      editor.value.state.selection.to
    )
    linkText.value = selectedText || ''
  }

  linkDialogVisible.value = true
}

// 关闭链接编辑对话框
const closeLinkDialog = () => {
  linkDialogVisible.value = false
  linkUrl.value = ''
  linkText.value = ''
}

// 保存链接
const saveLink = () => {
  if (!editor.value || !linkUrl.value) return

  // 如果有显示文本，先设置文本
  if (linkText.value && !editor.value.isActive('link')) {
    const selectedText = editor.value.state.doc.textBetween(
      editor.value.state.selection.from,
      editor.value.state.selection.to
    )

    if (selectedText !== linkText.value) {
      // 如果选中的文本和显示文本不同，替换选中的文本
      editor.value
        .chain()
        .focus()
        .insertContent(linkText.value)
        .run()
      // 选中新插入的文本
      const { from } = editor.value.state.selection
      editor.value
        .chain()
        .focus()
        .setTextSelection({ from, to: from + linkText.value.length })
        .run()
    }
  }

  // 设置链接
  editor.value
    .chain()
    .focus()
    .setLink({ href: linkUrl.value })
    .run()

  closeLinkDialog()
}

// 删除链接
const removeLink = () => {
  if (!editor.value) return

  editor.value
    .chain()
    .focus()
    .unsetLink()
    .run()

  closeLinkDialog()
}

// 处理命令选择
const handleCommandSelect = (command: any) => {
  if (!editor.value || !slashRange.value) return

  const { from, to } = slashRange.value

  // 删除斜杠和查询文本
  editor.value.view.dispatch(
    editor.value.state.tr.delete(from, to)
  )

  // 执行命令
  command.command({
    editor: editor.value,
    range: { from, to }
  })

  closeSlashCommand()
}

// ESC键退出全屏
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

// 监听外部值变化
watch(() => props.modelValue, (newValue, oldValue) => {
  // 只有在值真正从外部变化时才更新编辑器
  // 排除空内容的情况，避免与命令执行冲突
  if (editor.value && newValue !== oldValue) {
    const currentHTML = editor.value.getHTML()
    // 如果新值不为空且与当前值不同，则更新
    if (newValue && newValue !== currentHTML) {
      editor.value.commands.setContent(newValue, false)
    } else if (!newValue && !editor.value.isEmpty) {
      // 如果新值为空且编辑器不为空，则清空
      editor.value.commands.clearContent()
    }
  }
})

// 监听可编辑状态变化
watch(() => props.editable, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue)
  }
})

// 组件挂载时添加键盘监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  // 恢复body滚动
  if (isFullscreen.value) {
    document.body.style.overflow = ''
  }
  // 关闭斜杠命令
  closeSlashCommand()
  // 移除滚动监听
  removeScrollListener()
})

// 组件销毁时清理编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

// 暴露编辑器实例和全屏状态
defineExpose({
  editor,
  isFullscreen,
  closeSlashCommand
})
</script>

<style scoped>
.rich-text-editor {
  @apply border border-gray-300 rounded-lg overflow-hidden transition-colors duration-150;
}

.rich-text-editor:focus-within {
  @apply border-blue-500 ring-2 ring-blue-100;
}

/* 全屏模式 */
.rich-text-editor.fullscreen {
  @apply fixed inset-0 z-[9999] rounded-none m-0 flex flex-col;
}

/* 目录面板 (全屏时绝对定位在左侧) */
.rich-text-editor.fullscreen .table-of-contents {
  @apply fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 overflow-y-auto z-20;
}

.toc-header {
  @apply sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2 text-sm font-semibold text-gray-700 z-10 shadow-sm;
}

.toc-list {
  @apply px-3 py-2;
}

.toc-item {
  @apply px-3 py-2 text-sm text-gray-600 rounded cursor-pointer hover:bg-gray-100 transition-colors duration-150 truncate;
}

.toc-item.toc-level-1 {
  @apply font-semibold;
}

.toc-item.toc-level-2 {
  @apply pl-6;
}

.toc-item.toc-level-3 {
  @apply pl-10;
}

.toc-item.toc-active {
  @apply bg-blue-100 text-blue-700 font-medium;
}

/* 全屏模式主容器偏移 (为目录留出空间) */
.rich-text-editor.fullscreen > :not(.table-of-contents) {
  @apply ml-60;
}

/* 编辑器容器 (全屏模式下有目录时) */
.rich-text-editor.fullscreen .editor-content {
  @apply flex-1 overflow-y-auto;
}

.rich-text-editor.fullscreen .editor-content :deep(.ProseMirror) {
  @apply min-h-full max-w-4xl mx-auto py-8 px-8;
}

.rich-text-editor.fullscreen .editor-toolbar {
  @apply sticky top-0 z-10 bg-white shadow-md flex-shrink-0;
}

.rich-text-editor.fullscreen .editor-footer {
  @apply flex-shrink-0;
}

/* 工具栏 */
.editor-toolbar {
  @apply flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap;
}

.toolbar-group {
  @apply flex items-center gap-0.5;
}

.toolbar-divider {
  @apply w-px h-6 bg-gray-300 mx-1;
}

.toolbar-btn {
  @apply w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium;
}

.toolbar-btn.is-active {
  @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
}

.toolbar-btn:disabled:hover {
  @apply bg-transparent hover:bg-gray-200;
}

.toolbar-btn.fullscreen-btn {
  @apply text-blue-600 hover:bg-blue-50;
}

.toolbar-btn.fullscreen-btn:hover {
  @apply text-blue-700;
}

/* 编辑器内容区 */
.editor-content {
  @apply bg-white;
}

.editor-content :deep(.ProseMirror) {
  @apply p-3 min-h-[100px];
}

.editor-content :deep(.ProseMirror:focus) {
  @apply outline-none;
}

/* Placeholder 样式 */
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  @apply text-gray-400 pointer-events-none float-left h-0;
}

.editor-content :deep(.ProseMirror:focus p.is-editor-empty:first-child::before) {
  @apply text-gray-300;
}

/* 编辑器内容样式 */
.editor-content :deep(.ProseMirror) {
  font-family: inherit;
  line-height: 1.6;
}

.editor-content :deep(.ProseMirror h1) {
  @apply text-2xl font-bold mt-4 mb-2;
}

.editor-content :deep(.ProseMirror h2) {
  @apply text-xl font-bold mt-3 mb-2;
}

.editor-content :deep(.ProseMirror h3) {
  @apply text-lg font-bold mt-2 mb-1;
}

.editor-content :deep(.ProseMirror p) {
  @apply my-1;
}

/* Todo 列表样式 */
.editor-content :deep(.ProseMirror ul[data-type="taskList"]) {
  @apply list-none pl-0 my-2;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li) {
  @apply flex items-center my-1 gap-2;
}

.editor-content :deep(.ProseMirror ul[data-type="taskList"] li > label) {
  @apply flex items-center justify-center flex-shrink-0;
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

/* 普通列表样式 */
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

.editor-content :deep(.ProseMirror blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2;
}

.editor-content :deep(.ProseMirror pre) {
  @apply bg-gray-100 rounded p-3 my-2 font-mono text-sm overflow-x-auto;
}

.editor-content :deep(.ProseMirror code) {
  @apply bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-red-600;
}

.editor-content :deep(.ProseMirror pre code) {
  @apply bg-transparent p-0 text-gray-800;
}

.editor-content :deep(.ProseMirror hr) {
  @apply border-gray-300 my-4;
}

.editor-content :deep(.ProseMirror a) {
  @apply text-blue-600 underline cursor-pointer;
}

.editor-content :deep(.ProseMirror strong) {
  @apply font-bold;
}

.editor-content :deep(.ProseMirror em) {
  @apply italic;
}

.editor-content :deep(.ProseMirror s) {
  @apply line-through;
}

/* 底部信息栏 */
.editor-footer {
  @apply px-3 py-1.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-right;
}

.char-count {
  @apply text-gray-500;
}

/* 链接编辑对话框 */
.link-dialog-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000];
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
</style>
