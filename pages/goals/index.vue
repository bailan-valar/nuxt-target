<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">我的目标</h1>
        <p class="text-sm text-gray-600 mt-1">管理和追踪您的目标进度</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- 视图切换 -->
        <div class="inline-flex rounded-lg border border-gray-300 p-1">
          <button
            @click="switchView('year')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'year' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            年
          </button>
          <button
            @click="switchView('month')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            月
          </button>
          <button
            @click="switchView('week')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            周
          </button>
        </div>

        <!-- 新增按钮 -->
        <button
          @click="showModal = true"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新增目标
        </button>
      </div>
    </div>

    <!-- 日期选择器 -->
    <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- 年视图：年份选择 -->
        <div v-if="view === 'year'" class="flex items-center gap-2">
          <button
            @click="year--"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="上一年"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-lg font-semibold text-gray-900 min-w-[80px] text-center">{{ year }}年</span>
          <button
            @click="year++"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="下一年"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- 月视图：年月选择 -->
        <div v-else-if="view === 'month'" class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <button
              @click="prevMonth"
              class="p-1 hover:bg-gray-100 rounded transition-colors"
              title="上一月"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="text-lg font-semibold text-gray-900 min-w-[120px] text-center">{{ year }}年 {{ month }}月</span>
            <button
              @click="nextMonth"
              class="p-1 hover:bg-gray-100 rounded transition-colors"
              title="下一月"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 周视图：年月周选择 -->
        <div v-else-if="view === 'week'" class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <button
              @click="prevWeek"
              class="p-1 hover:bg-gray-100 rounded transition-colors"
              title="上一周"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="text-lg font-semibold text-gray-900 min-w-[200px] text-center">{{ weekRangeText }}</span>
            <button
              @click="nextWeek"
              class="p-1 hover:bg-gray-100 rounded transition-colors"
              title="下一周"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex-1"></div>

        <!-- 快捷按钮 -->
        <button
          @click="goToToday"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          今天
        </button>
      </div>
    </div>

    <GoalModal
      :show="showModal"
      :defaults="goalModalDefaults"
      @close="handleCloseGoalModal"
      @saved="handleSaved"
    />

    <!-- 加载状态 -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-800">{{ error.message }}</p>
      </div>
    </div>

    <!-- 表格视图 -->
    <div v-else class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px]">场景</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px]">分组</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">项目</th>
              <th v-if="hasSubprojects" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">子项目</th>

              <!-- 年视图：年目标 + 12个月 -->
              <template v-if="view === 'year'">
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年目标</th>
                <th v-for="m in 12" :key="m" class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">{{ m }}月</th>
              </template>

              <!-- 月视图：月目标 + 4-5周 -->
              <template v-else-if="view === 'month'">
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月目标</th>
                <th v-for="week in monthWeeks" :key="week.index" class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  <div class="flex flex-col items-center gap-1">
                    <span>第{{ week.index }}周</span>
                    <span class="text-xs text-gray-400">{{ week.range }}</span>
                  </div>
                </th>
              </template>

              <!-- 周视图：周目标 + 7天 -->
              <template v-else-if="view === 'week'">
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">周目标</th>
                <th v-for="day in weekDays" :key="day.date" class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px]">
                  <div class="flex flex-col items-center gap-1">
                    <span :class="{ 'text-blue-600 font-semibold': isToday(day.date) }">{{ day.weekday }}</span>
                    <span :class="{ 'text-blue-600 font-semibold': isToday(day.date) }" class="text-xs">{{ day.day }}</span>
                  </div>
                </th>
              </template>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(row, rowIndex) in typedTableData" :key="rowIndex">
              <tr class="hover:bg-gray-50">
                <!-- 场景列 -->
                <td
                  v-if="shouldShowCell('scene', rowIndex)"
                  :rowspan="row.rowspans.scene ?? 1"
                  class="px-4 py-3 align-top"
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
                  class="px-4 py-3 align-top"
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
                  class="px-4 py-3 align-top"
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
                  v-if="hasSubprojects && shouldShowCell('subproject', rowIndex)"
                  :rowspan="row.rowspans.subproject ?? 1"
                  class="px-4 py-3 align-top"
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

                <!-- 目标列和日期列 -->
                <template v-if="view === 'year'">
                  <!-- 年目标列 -->
                  <td class="px-4 py-3 text-sm">
                    <GoalCell :goal="row.mainGoal" :period-type="'YEAR'" :period-value="String(year)" @add="openAddGoal('YEAR', String(year), row)" />
                  </td>
                  <!-- 12个月份列 -->
                  <td v-for="m in 12" :key="m" class="px-2 py-2 text-sm">
                    <GoalCell
                      :goal="getChildGoal(row.mainGoal, 'MONTH', `${year}-${String(m).padStart(2, '0')}`)"
                      :period-type="'MONTH'"
                      :period-value="`${year}-${String(m).padStart(2, '0')}`"
                      :compact="true"
                      @add="openAddGoal('MONTH', `${year}-${String(m).padStart(2, '0')}`, row)"
                    />
                  </td>
                </template>

                <template v-else-if="view === 'month'">
                  <!-- 月目标列 -->
                  <td class="px-4 py-3 text-sm">
                    <GoalCell :goal="row.mainGoal" :period-type="'MONTH'" :period-value="`${year}-${String(month).padStart(2, '0')}`" @add="openAddGoal('MONTH', `${year}-${String(month).padStart(2, '0')}`, row)" />
                  </td>
                  <!-- 4-5周列 -->
                  <td v-for="week in monthWeeks" :key="week.index" class="px-2 py-2 text-sm">
                    <GoalCell
                      :goal="getChildGoal(row.mainGoal, 'WEEK', week.value)"
                      :period-type="'WEEK'"
                      :period-value="week.value"
                      :compact="true"
                      @add="openAddGoal('WEEK', week.value, row)"
                    />
                  </td>
                </template>

                <template v-else-if="view === 'week'">
                  <!-- 周目标列 -->
                  <td class="px-4 py-3 text-sm">
                    <GoalCell :goal="row.mainGoal" :period-type="'WEEK'" :period-value="currentWeekValue" @add="openAddGoal('WEEK', currentWeekValue, row)" />
                  </td>
                  <!-- 7天列 -->
                  <td v-for="day in weekDays" :key="day.date" class="px-2 py-2 text-sm">
                    <GoalCell
                      :goal="getChildGoal(row.mainGoal, 'DAY', day.date)"
                      :period-type="'DAY'"
                      :period-value="day.date"
                      :compact="true"
                      @add="openAddGoal('DAY', day.date, row)"
                    />
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
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

    <!-- 文件夹模态框 -->
    <FolderModal
      :show="showFolderModal"
      :folder="selectedFolder"
      :parentId="parentFolderId"
      :parentFolderName="parentFolderName"
      @close="handleCloseFolderModal"
      @saved="handleFolderSaved"
    />

    <!-- 移动模态框 -->
    <MoveFolderModal
      :show="showMoveModal"
      :folder="selectedFolder"
      @close="showMoveModal = false"
      @moved="handleFolderMoved"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// 目标单元格组件
const GoalCell = defineComponent({
  props: {
    goal: { type: Object as PropType<any>, default: null },
    periodType: { type: String as PropType<string>, required: true },
    periodValue: { type: String as PropType<string>, required: true },
    compact: { type: Boolean, default: false }
  },
  emits: ['add'],
  setup(props, { emit }) {
    const hasChildGoals = computed(() => {
      return props.goal?.children && props.goal.children.length > 0
    })

    const childGoalsForPeriod = computed(() => {
      if (!props.goal?.children) return []
      return props.goal.children.filter((g: any) =>
        g.periodType === props.periodType && g.periodValue === props.periodValue
      )
    })

    return () => h('div', { class: 'goal-cell-container' }, [
      // 显示当前层级目标
      props.goal ? h('div', { class: 'goal-item' }, [
        h('div', { class: 'flex items-center gap-2' }, [
          h('span', { class: 'goal-title' }, props.goal.title),
          hasChildGoals.value ? h('span', { class: 'goal-badge' }, `${props.goal.children.length}`) : null
        ])
      ]) : h('button', {
        class: 'add-goal-btn',
        onClick: () => emit('add')
      }, [
        h('svg', {
          class: 'w-4 h-4',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        }, [h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 4v16m8-8H4'
        })])
      ]),

      // 显示子目标
      !props.compact && childGoalsForPeriod.value.length > 0 ? h('div', { class: 'child-goals mt-2' },
        childGoalsForPeriod.value.map((child: any) =>
          h('div', { class: 'child-goal-item text-xs' }, [
            h('span', { class: 'text-gray-600' }, child.title)
          ])
        )
      ) : null
    ])
  }
})

const { signOut } = useAuth()
const view = ref<'year' | 'month' | 'week'>('year')
const showModal = ref(false)

// 目标模态框默认值
const goalModalDefaults = ref<{
  folderId: string | null
  periodType: string
  periodValue: string
} | null>(null)

// 日期状态
const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth() + 1)
const weekStart = ref(getWeekStart(today))

const { data, pending, error, refresh } = await useFetch('/api/goals')
const goals = computed(() => data.value?.data || [])

// 获取文件夹数据
const { data: foldersData } = await useFetch('/api/folders', {
  query: {
    expandAll: true,
    includeGoals: false
  }
})

const folders = computed(() => foldersData.value?.data || [])

// 计算属性：是否存在子项目数据
const hasSubprojects = computed(() => {
  return typedTableData.value.some(row => row.subproject !== null)
})

// 右键菜单状态
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuFolder = ref<any>()

// 文件夹模态框状态
const showFolderModal = ref(false)
const selectedFolder = ref<any>()
const parentFolderId = ref<string | null>(null)
const parentFolderName = ref<string>('')

// 移动模态框状态
const showMoveModal = ref(false)

// 计算属性：当前周的值
const currentWeekValue = computed(() => {
  return formatWeekValue(weekStart.value)
})

// 计算属性：周范围文本
const weekRangeText = computed(() => {
  const start = weekStart.value
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`
})

// 计算属性：本月包含的周
const monthWeeks = computed(() => {
  const weeks: { index: number; range: string; value: string }[] = []
  const firstDay = new Date(year.value, month.value - 1, 1)
  const lastDay = new Date(year.value, month.value, 0)

  let current = getWeekStart(firstDay)
  let weekIndex = 1

  while (current <= lastDay) {
    const weekEnd = new Date(current)
    weekEnd.setDate(Math.min(weekEnd.getDate() + 6, getLastDayOfMonth(weekEnd)))

    weeks.push({
      index: weekIndex,
      range: `${current.getMonth() + 1}/${current.getDate()}`,
      value: formatWeekValue(current)
    })

    // 移动到下一周
    current.setDate(current.getDate() + 7)
    current = getWeekStart(current)
    weekIndex++
  }

  return weeks
})

// 计算属性：本周的7天
const weekDays = computed(() => {
  const days: { date: string; weekday: string; day: string }[] = []
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart.value)
    date.setDate(date.getDate() + i)

    days.push({
      date: formatDateStr(date),
      weekday: weekdays[i],
      day: String(date.getDate())
    })
  }

  return days
})

// 表格数据（按类型组织）
interface TypedRow {
  scene: any
  group: any
  project: any
  subproject: any
  mainGoal: any
  rowspans: {
    scene: number | null
    group: number | null
    project: number | null
    subproject: number | null
  }
}

const typedTableData = computed<TypedRow[]>(() => {
  const result: TypedRow[] = []
  const scenes = folders.value.filter(f => f.type === 'SCENE')

  if (scenes.length === 0) {
    result.push({
      scene: null,
      group: null,
      project: null,
      subproject: null,
      mainGoal: null,
      rowspans: { scene: 1, group: null, project: null, subproject: null }
    })
  } else {
    for (const scene of scenes) {
      const sceneRows = generateTypedRows(scene)
      result.push(...sceneRows)
    }
  }

  calculateRowspans(result)
  return result
})

// 辅助函数
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function getLastDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function formatWeekValue(date: Date): string {
  return `${date.getFullYear()}-W${getWeekNumber(date)}`
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function formatDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isToday(dateStr: string): boolean {
  const today = new Date()
  const date = new Date(dateStr)
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

// 视图切换
function switchView(newView: 'year' | 'month' | 'week') {
  view.value = newView
}

// 导航函数
function prevMonth() {
  if (month.value === 1) {
    month.value = 12
    year.value--
  } else {
    month.value--
  }
}

function nextMonth() {
  if (month.value === 12) {
    month.value = 1
    year.value++
  } else {
    month.value++
  }
}

function prevWeek() {
  weekStart.value.setDate(weekStart.value.getDate() - 7)
}

function nextWeek() {
  weekStart.value.setDate(weekStart.value.getDate() + 7)
}

function goToToday() {
  const today = new Date()
  year.value = today.getFullYear()
  month.value = today.getMonth() + 1
  weekStart.value = getWeekStart(today)
}

// 获取子目标
function getChildGoal(parentGoal: any, periodType: string, periodValue: string): any {
  if (!parentGoal?.children) return null
  return parentGoal.children.find((g: any) =>
    g.periodType === periodType && g.periodValue === periodValue
  ) || null
}

// 获取当前行的最小子节点文件夹ID
function getDeepestFolderId(row: TypedRow): string | null {
  // 优先级：子项目 > 项目 > 分组 > 场景
  if (row.subproject) return row.subproject.id
  if (row.project) return row.project.id
  if (row.group) return row.group.id
  if (row.scene) return row.scene.id
  return null
}

// 打开添加目标模态框
function openAddGoal(periodType: string, periodValue: string, row?: TypedRow) {
  // 设置默认值
  goalModalDefaults.value = {
    folderId: row ? getDeepestFolderId(row) : null,
    periodType,
    periodValue
  }
  showModal.value = true
}

// 表格行生成函数
function generateTypedRows(scene: any): TypedRow[] {
  const result: TypedRow[] = []
  const groups = (scene.children || []).filter((f: any) => f.type === 'GROUP')
  const projects = (scene.children || []).filter((f: any) => f.type === 'PROJECT')

  if (groups.length === 0 && projects.length === 0) {
    const mainGoal = getMainGoalForFolder(scene.id, view.value)
    result.push({
      scene,
      group: null,
      project: null,
      subproject: null,
      mainGoal,
      rowspans: { scene: 1, group: null, project: null, subproject: null }
    })
  } else if (groups.length === 0) {
    for (const project of projects) {
      const projectRows = generateProjectRows(project, scene, null)
      result.push(...projectRows)
    }
  } else {
    for (const group of groups) {
      const groupRows = generateGroupRows(group, scene)
      result.push(...groupRows)
    }
  }

  return result
}

function generateGroupRows(group: any, scene: any): TypedRow[] {
  const result: TypedRow[] = []
  const projects = (group.children || []).filter((f: any) => f.type === 'PROJECT')

  if (projects.length === 0) {
    const mainGoal = getMainGoalForFolder(group.id, view.value)
    result.push({
      scene,
      group,
      project: null,
      subproject: null,
      mainGoal,
      rowspans: { scene: null, group: 1, project: null, subproject: null }
    })
  } else {
    for (const project of projects) {
      const projectRows = generateProjectRows(project, scene, group)
      result.push(...projectRows)
    }
  }

  return result
}

function generateProjectRows(project: any, scene: any, group: any | null): TypedRow[] {
  const result: TypedRow[] = []
  const subprojects = (project.children || []).filter((f: any) => f.type === 'SUBPROJECT')

  if (subprojects.length === 0) {
    const mainGoal = getMainGoalForFolder(project.id, view.value)
    result.push({
      scene,
      group,
      project,
      subproject: null,
      mainGoal,
      rowspans: { scene: null, group: null, project: 1, subproject: null }
    })
  } else {
    for (const subproject of subprojects) {
      const mainGoal = getMainGoalForFolder(subproject.id, view.value)
      result.push({
        scene,
        group,
        project,
        subproject,
        mainGoal,
        rowspans: { scene: null, group: null, project: null, subproject: 1 }
      })
    }
  }

  return result
}

// 根据当前视图获取主目标
function getMainGoalForFolder(folderId: string, currentView: string): any {
  let targetType: string = 'YEAR'

  if (currentView === 'month') {
    targetType = 'MONTH'
  } else if (currentView === 'week') {
    targetType = 'WEEK'
  }

  const folderGoals = goals.value.filter((g: any) => g.folderId === folderId)

  // 查找对应视图类型的主目标（无父目标的）
  let mainGoal = folderGoals.find((g: any) => g.periodType === targetType && !g.parentId)

  // 年视图特殊处理：如果没有年目标，但该文件夹有月度目标，创建一个虚拟的年目标来承载这些月度目标
  if (currentView === 'year' && !mainGoal) {
    const monthGoals = folderGoals.filter((g: any) => g.periodType === 'MONTH' && !g.parentId)
    if (monthGoals.length > 0) {
      // 创建一个虚拟年目标，包含这些月度目标作为子目标
      mainGoal = {
        id: `virtual-year-${folderId}`,
        title: '',
        periodType: 'YEAR',
        periodValue: String(year.value),
        folderId,
        children: monthGoals,
        isVirtual: true
      }
    }
  }

  return mainGoal || null
}

// 计算rowspan实现向上合并
function calculateRowspans(rows: TypedRow[]) {
  for (const row of rows) {
    row.rowspans = { scene: 1, group: 1, project: 1, subproject: 1 }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    if (!rows[i - 1] || rows[i - 1].scene !== row.scene) {
      let span = 1
      for (let j = i + 1; j < rows.length && rows[j].scene === row.scene; j++) {
        span++
      }
      row.rowspans.scene = span
    }

    if (!rows[i - 1] || rows[i - 1].scene !== row.scene || rows[i - 1].group !== row.group) {
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

    row.rowspans.subproject = 1
  }
}

function shouldShowCell(columnType: 'scene' | 'group' | 'project' | 'subproject', rowIndex: number): boolean {
  const rows = typedTableData.value

  for (let i = rowIndex - 1; i >= 0; i--) {
    const prevRow = rows[i]
    const prevRowspan = prevRow.rowspans[columnType]

    if (prevRowspan && prevRowspan > 1) {
      const mergeEnd = i + prevRowspan
      if (rowIndex < mergeEnd) {
        return false
      }
      break
    }
  }

  return true
}

// 右键菜单处理
const handleContextMenu = (event: MouseEvent, folder: any) => {
  event.preventDefault()
  contextMenuFolder.value = folder
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  showContextMenu.value = true
}

const handleEditFolder = () => {
  if (contextMenuFolder.value) {
    selectedFolder.value = contextMenuFolder.value
    showFolderModal.value = true
  }
  showContextMenu.value = false
}

const handleAddSubfolder = async () => {
  if (contextMenuFolder.value) {
    const parent = contextMenuFolder.value
    parentFolderId.value = parent.id
    parentFolderName.value = parent.name
    selectedFolder.value = undefined
    await nextTick()
    showFolderModal.value = true
  }
  showContextMenu.value = false
}

const handleMoveFolder = () => {
  if (contextMenuFolder.value) {
    selectedFolder.value = contextMenuFolder.value
    showMoveModal.value = true
  }
  showContextMenu.value = false
}

const handleDeleteFolder = async () => {
  if (contextMenuFolder.value) {
    const confirmed = confirm(
      `确定要删除文件夹"${contextMenuFolder.value.name}"吗？`
    )

    if (confirmed) {
      try {
        await $fetch(`/api/folders/${contextMenuFolder.value.id}`, {
          method: 'DELETE'
        })
        refresh()
      } catch (e: any) {
        alert(e.data?.message || '删除失败')
      }
    }
  }
  showContextMenu.value = false
}

// 文件夹保存成功
const handleFolderSaved = () => {
  showFolderModal.value = false
  selectedFolder.value = undefined
  parentFolderId.value = null
  parentFolderName.value = ''
  refresh()
}

// 文件夹移动成功
const handleFolderMoved = () => {
  showMoveModal.value = false
  refresh()
}

// 关闭模态框
const handleCloseFolderModal = () => {
  showFolderModal.value = false
  selectedFolder.value = undefined
  parentFolderId.value = null
  parentFolderName.value = ''
}

const handleSaved = () => {
  refresh()
}

const handleCloseGoalModal = () => {
  showModal.value = false
  goalModalDefaults.value = null
}

const handleSignOut = async () => {
  await signOut()
  await navigateTo('/')
}
</script>

<style scoped>
.folder-cell {
  @apply flex items-start gap-2 rounded px-2 py-1 -mx-2 -my-1 transition-colors cursor-pointer;
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

.goal-cell-container {
  @apply flex flex-col gap-1;
}

.goal-item {
  @apply flex items-center gap-2;
}

.goal-title {
  @apply text-sm text-gray-900 font-medium;
}

.goal-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800;
}

.child-goals {
  @apply flex flex-col gap-1 pl-2 border-l-2 border-gray-200;
}

.child-goal-item {
  @apply text-gray-600;
}

.add-goal-btn {
  @apply inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors;
}

.add-goal-btn:hover {
  @apply bg-blue-100;
}
</style>
