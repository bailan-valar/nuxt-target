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

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 6h13M8 12h13M8 18h13"/>
            <text x="3" y="7.5" font-size="6" fill="currentColor">1</text>
            <text x="3" y="13.5" font-size="6" fill="currentColor">2</text>
            <text x="3" y="19.5" font-size="6" fill="currentColor">3</text>
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
import { watch, onBeforeUnmount, onMounted, onUnmounted, ref, markRaw } from 'vue'
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
  placeholder: '请输入内容...',
  editable: true,
  showCharCount: false,
  minHeight: '100px'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 全屏状态
const isFullscreen = ref(false)

// 斜杠命令状态
const slashCommandVisible = ref(false)
const slashCommandPosition = ref({ top: 0, left: 0 })
const slashQuery = ref('')
const slashRange = ref<any>(null)

// 命令列表（带图标组件）
const slashCommands = ref(
  defaultCommands.map(cmd => ({
    ...cmd,
    icon: markRaw((icons as any)[cmd.icon] || icons.Paragraph)
  }))
)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px]',
      style: `min-height: ${props.minHeight}`
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

    // 检查斜杠命令触发
    checkSlashCommand(editor)
  },
  onSelectionUpdate: ({ editor }) => {
    // 选择变化时关闭斜杠命令
    if (!editor.state.selection.empty) {
      closeSlashCommand()
    }
  },
  onCreate: ({ editor }) => {
    if (!props.modelValue) {
      editor.commands.setContent('<p></p>')
    }
  }
})

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value

  // 全屏时禁止body滚动
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 检查斜杠命令触发
const checkSlashCommand = (editor: any) => {
  const { state } = editor
  const { selection } = state
  const { $from } = selection

  // 检查是否在段落或标题中
  const node = $from.parent
  if (!node || (node.type.name !== 'paragraph' && node.type.name !== 'heading')) {
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
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue || '<p></p>', false)
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

.rich-text-editor.fullscreen .editor-content {
  @apply flex-1 overflow-y-auto;
}

.rich-text-editor.fullscreen .editor-content :deep(.ProseMirror) {
  @apply min-h-full max-w-4xl mx-auto py-8;
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

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  @apply float-left text-gray-400 pointer-events-none h-0;
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
</style>
