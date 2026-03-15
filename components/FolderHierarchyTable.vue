<template>
  <div class="folder-hierarchy-table">
    <div class="table-container">
      <table class="hierarchy-table">
        <thead>
          <tr>
            <th>场景</th>
            <th>分组</th>
            <th>项目</th>
            <th>子项目</th>
            <th class="actions-header">操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, rowIndex) in typedTableData" :key="rowIndex">
            <tr>
              <!-- 场景列 -->
              <td
                v-if="shouldShowCell('scene', rowIndex)"
                :rowspan="row.rowspans.scene ?? 1"
                class="scene-cell"
              >
                <div v-if="row.scene" class="folder-cell" @contextmenu.prevent="handleContextMenu($event, row.scene)">
                  <div class="folder-icon" :style="{ color: row.scene.color || undefined }">
                    <svg
                      v-if="!row.scene.icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span v-else>{{ row.scene.icon }}</span>
                  </div>
                  <div class="folder-info">
                    <span class="name">{{ row.scene.name }}</span>
                  </div>
                </div>
                <span v-else class="empty-text">-</span>
              </td>

              <!-- 分组列 -->
              <td
                v-if="shouldShowCell('group', rowIndex)"
                :rowspan="row.rowspans.group ?? 1"
                class="group-cell"
              >
                <div v-if="row.group" class="folder-cell" @contextmenu.prevent="handleContextMenu($event, row.group)">
                  <div class="folder-icon" :style="{ color: row.group.color || undefined }">
                    <svg
                      v-if="!row.group.icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span v-else>{{ row.group.icon }}</span>
                  </div>
                  <div class="folder-info">
                    <span class="name">{{ row.group.name }}</span>
                  </div>
                </div>
                <span v-else class="empty-text">-</span>
              </td>

              <!-- 项目列 -->
              <td
                v-if="shouldShowCell('project', rowIndex)"
                :rowspan="row.rowspans.project ?? 1"
                class="project-cell"
              >
                <div v-if="row.project" class="folder-cell" @contextmenu.prevent="handleContextMenu($event, row.project)">
                  <div class="folder-icon" :style="{ color: row.project.color || undefined }">
                    <svg
                      v-if="!row.project.icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span v-else>{{ row.project.icon }}</span>
                  </div>
                  <div class="folder-info">
                    <span class="name">{{ row.project.name }}</span>
                  </div>
                </div>
                <span v-else class="empty-text">-</span>
              </td>

              <!-- 子项目列 -->
              <td
                v-if="shouldShowCell('subproject', rowIndex)"
                :rowspan="row.rowspans.subproject ?? 1"
                class="subproject-cell"
              >
                <div v-if="row.subproject" class="folder-cell" @contextmenu.prevent="handleContextMenu($event, row.subproject)">
                  <div class="folder-icon" :style="{ color: row.subproject.color || undefined }">
                    <svg
                      v-if="!row.subproject.icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span v-else>{{ row.subproject.icon }}</span>
                  </div>
                  <div class="folder-info">
                    <span class="name">{{ row.subproject.name }}</span>
                  </div>
                </div>
                <span v-else class="empty-text">-</span>
              </td>

              <!-- 操作列 -->
              <td class="actions-cell">
                <div class="actions">
                  <button
                    @click="$emit('edit', row.rootFolder)"
                    class="action-btn"
                    title="编辑"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    @click="$emit('add-subfolder', row.rootFolder)"
                    class="action-btn"
                    title="添加子文件夹"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      <line x1="12" y1="11" x2="12" y2="17"></line>
                      <line x1="9" y1="14" x2="15" y2="14"></line>
                    </svg>
                  </button>
                  <button
                    @click="$emit('delete', row.rootFolder)"
                    class="action-btn danger"
                    title="删除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="typedTableData.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
      <p>暂无文件夹</p>
    </div>

    <!-- 右键菜单 -->
    <FolderContextMenu
      :show="showContextMenu"
      :x="contextMenuPosition.x"
      :y="contextMenuPosition.y"
      @edit="handleEditFolder"
      @add-subfolder="handleAddSubfolder"
      @move="handleMoveFolder"
      @delete="handleDeleteFolder"
      @close="showContextMenu = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types'

interface Props {
  folders: Folder[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [folder: Folder]
  'add-subfolder': [folder: Folder]
  delete: [folder: Folder]
  move: [folder: Folder]
}>()

// 右键菜单状态
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuFolder = ref<Folder>()

// 删除不再需要的列标题计算
// const columnHeaders = computed(() => { ... })

// 表格数据（按类型组织）
interface TypedRow {
  scene: Folder | null
  group: Folder | null
  project: Folder | null
  subproject: Folder | null
  rootFolder: Folder
  rowspans: {
    scene: number | null
    group: number | null
    project: number | null
    subproject: number | null
  }
}

const typedTableData = computed<TypedRow[]>(() => {
  const result: TypedRow[] = []

  // 获取所有场景（一级目录）
  const scenes = props.folders.filter(f => f.type === 'SCENE')

  for (const scene of scenes) {
    const sceneRows = generateTypedRows(scene)
    result.push(...sceneRows)
  }

  // 计算rowspan（向上合并）
  calculateRowspans(result)

  return result
})

// 计算rowspan实现向上合并
function calculateRowspans(rows: TypedRow[]) {
  // 先重置所有rowspan
  for (const row of rows) {
    row.rowspans = {
      scene: 1,
      group: 1,
      project: 1,
      subproject: 1
    }
  }

  // 计算每个单元格的rowspan（包括null值的合并）
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    // 场景列：合并连续相同的场景
    if (!rows[i - 1] || rows[i - 1].scene !== row.scene) {
      let span = 1
      for (let j = i + 1; j < rows.length && rows[j].scene === row.scene; j++) {
        span++
      }
      row.rowspans.scene = span
    }

    // 分组列：合并连续相同的分组（在同一场景内）
    if (!rows[i - 1] ||
        rows[i - 1].scene !== row.scene ||
        rows[i - 1].group !== row.group) {
      let span = 1
      for (let j = i + 1; j < rows.length; j++) {
        if (rows[j].scene === row.scene && rows[j].group === row.group) {
          span++
        } else {
          break
        }
      }
      row.rowspans.group = span
    }

    // 项目列：合并连续相同的项目（在同一场景和分组内）
    if (!rows[i - 1] ||
        rows[i - 1].scene !== row.scene ||
        rows[i - 1].group !== row.group ||
        rows[i - 1].project !== row.project) {
      let span = 1
      for (let j = i + 1; j < rows.length; j++) {
        if (rows[j].scene === row.scene &&
            rows[j].group === row.group &&
            rows[j].project === row.project) {
          span++
        } else {
          break
        }
      }
      row.rowspans.project = span
    }

    // 子项目不合并
    row.rowspans.subproject = 1
  }
}

// 生成基于类型的表格行
function generateTypedRows(scene: Folder): TypedRow[] {
  const result: TypedRow[] = []
  const groups = (scene.children || []).filter(f => f.type === 'GROUP')

  if (groups.length === 0) {
    // 没有分组，直接创建项目行
    const projects = (scene.children || []).filter(f => f.type === 'PROJECT')

    if (projects.length === 0) {
      // 场景下没有任何内容，创建空行
      result.push({
        scene,
        group: null,
        project: null,
        subproject: null,
        rootFolder: scene,
        rowspans: {
          scene: 1,
          group: null,
          project: null,
          subproject: null
        }
      })
    } else {
      // 有项目，创建项目行
      for (const project of projects) {
        const projectRows = generateProjectRows(project, scene, null)
        result.push(...projectRows)
      }
    }
  } else {
    // 有分组，递归处理
    for (const group of groups) {
      const groupRows = generateGroupRows(group, scene)
      result.push(...groupRows)
    }
  }

  return result
}

// 生成分组行
function generateGroupRows(group: Folder, scene: Folder): TypedRow[] {
  const result: TypedRow[] = []
  const projects = (group.children || []).filter(f => f.type === 'PROJECT')

  if (projects.length === 0) {
    // 分组下没有项目，创建空行
    result.push({
      scene,
      group,
      project: null,
      subproject: null,
      rootFolder: scene,
      rowspans: {
        scene: null,
        group: 1,
        project: null,
        subproject: null
      }
    })
  } else {
    // 有项目，递归处理
    for (const project of projects) {
      const projectRows = generateProjectRows(project, scene, group)
      result.push(...projectRows)
    }
  }

  return result
}

// 生成项目行
function generateProjectRows(project: Folder, scene: Folder, group: Folder | null): TypedRow[] {
  const result: TypedRow[] = []
  const subprojects = (project.children || []).filter(f => f.type === 'SUBPROJECT')

  if (subprojects.length === 0) {
    // 项目下没有子项目，创建单行
    result.push({
      scene,
      group,
      project,
      subproject: null,
      rootFolder: scene,
      rowspans: {
        scene: null,
        group: null,
        project: 1,
        subproject: null
      }
    })
  } else {
    // 有子项目，递归处理
    for (const subproject of subprojects) {
      result.push({
        scene,
        group,
        project,
        subproject,
        rootFolder: scene,
        rowspans: {
          scene: null,
          group: null,
          project: null,
          subproject: 1
        }
      })
    }
  }

  return result
}

// 判断是否应该显示该单元格
function shouldShowCell(columnType: 'scene' | 'group' | 'project' | 'subproject', rowIndex: number): boolean {
  const rows = typedTableData.value
  const currentRow = rows[rowIndex]

  // 向上查找，检查是否被合并
  for (let i = rowIndex - 1; i >= 0; i--) {
    const prevRow = rows[i]
    const prevRowspan = prevRow.rowspans[columnType]

    // 如果上一行有rowspan，检查当前行是否在合并范围内
    if (prevRowspan && prevRowspan > 1) {
      const mergeEnd = i + prevRowspan
      if (rowIndex < mergeEnd) {
        return false // 被合并，不显示
      }
      break // 已经不在合并范围内，停止查找
    }
  }

  // 没有被合并，显示单元格
  return true
}

// 右键菜单处理
const handleContextMenu = (event: MouseEvent, folder: Folder) => {
  contextMenuFolder.value = folder
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  showContextMenu.value = true
}

const handleEditFolder = () => {
  if (contextMenuFolder.value) {
    emit('edit', contextMenuFolder.value)
  }
  showContextMenu.value = false
}

const handleAddSubfolder = () => {
  if (contextMenuFolder.value) {
    emit('add-subfolder', contextMenuFolder.value)
  }
  showContextMenu.value = false
}

const handleMoveFolder = () => {
  if (contextMenuFolder.value) {
    emit('move', contextMenuFolder.value)
  }
  showContextMenu.value = false
}

const handleDeleteFolder = () => {
  if (contextMenuFolder.value) {
    emit('delete', contextMenuFolder.value)
  }
  showContextMenu.value = false
}
</script>

<style scoped>
.folder-hierarchy-table {
  @apply w-full;
}

.table-container {
  @apply overflow-x-auto;
}

.hierarchy-table {
  @apply w-full border-collapse;
}

.hierarchy-table thead {
  @apply bg-gray-50;
}

.hierarchy-table th {
  @apply px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 whitespace-nowrap;
}

.hierarchy-table tbody tr {
  @apply border-t border-gray-200 hover:bg-gray-50 transition-colors;
}

.hierarchy-table td {
  @apply px-4 py-3 align-top;
}

.scene-cell,
.group-cell,
.project-cell,
.subproject-cell {
  @apply min-w-[180px];
}

.folder-cell {
  @apply flex items-start gap-2 cursor-pointer rounded px-2 py-1 -mx-2 -my-1 transition-colors;
}

.folder-cell:hover {
  @apply bg-gray-100;
}

.folder-icon {
  @apply flex-shrink-0 mt-0.5 text-gray-400;
}

.folder-info {
  @apply flex flex-col gap-1;
}

.name {
  @apply font-medium text-gray-900 text-sm;
}

.empty-text {
  @apply text-gray-400 text-sm;
}

.actions-header {
  @apply min-w-[120px];
}

.actions-cell {
  @apply min-w-[120px] sticky right-0 bg-white;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
}

.actions {
  @apply flex items-center gap-1;
}

.action-btn {
  @apply p-1.5 rounded hover:bg-gray-200 transition-colors;
}

.action-btn.danger {
  @apply hover:bg-red-100 hover:text-red-600;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-gray-400;
}

.empty-state svg {
  @apply mb-4;
}

.empty-state p {
  @apply text-sm;
}

/* 滚动条样式 */
.table-container::-webkit-scrollbar {
  @apply h-2;
}

.table-container::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.table-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

.table-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
