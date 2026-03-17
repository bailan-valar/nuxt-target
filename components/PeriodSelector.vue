<template>
  <div class="period-selector">
    <div class="field">
      <label for="period-type">周期类型</label>
      <select
        id="period-type"
        v-model="localPeriodType"
        @change="handlePeriodTypeChange"
      >
        <option value="">不设置周期</option>
        <option value="YEAR">年目标</option>
        <option value="MONTH">月目标</option>
        <option value="WEEK">周目标</option>
        <option value="TASK">任务</option>
      </select>
    </div>

    <div v-if="localPeriodType" class="field">
      <label for="period-value">{{ periodLabel }}</label>
      <input
        v-if="localPeriodType === 'YEAR'"
        id="period-value"
        v-model="localPeriodValue"
        type="number"
        :placeholder="currentYearValue"
        min="2000"
        max="2100"
        step="1"
      />
      <input
        v-else-if="localPeriodType === 'MONTH'"
        id="period-value"
        v-model="localPeriodValue"
        type="month"
        :placeholder="currentMonthValue"
      />
      <div v-else-if="localPeriodType === 'WEEK'" class="week-input">
        <input
          v-model="weekYear"
          type="number"
          placeholder="年份"
          min="2000"
          max="2100"
          class="week-year"
        />
        <input
          v-model="weekNumber"
          type="number"
          placeholder="周"
          min="1"
          max="53"
          class="week-number"
        />
      </div>
      <input
        v-else-if="localPeriodType === 'TASK'"
        id="period-value"
        v-model="localPeriodValue"
        type="date"
        :placeholder="currentTaskValue"
      />
      <button
        v-if="localPeriodType"
        type="button"
        @click="setCurrentPeriod"
        class="set-current-btn"
        title="设置为当前周期"
      >
        设为当前
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentPeriodValue } from '~/lib/validations/period-utils'

type PeriodType = 'YEAR' | 'MONTH' | 'WEEK' | 'TASK' | ''

const props = defineProps<{
  periodType?: PeriodType
  periodValue?: string
}>()

const emit = defineEmits<{
  'update:periodType': [value: PeriodType]
  'update:periodValue': [value: string]
}>()

const localPeriodType = ref<PeriodType>(props.periodType || '')
const localPeriodValue = ref(props.periodValue || '')

// 周目标需要分别输入年份和周数
const weekYear = computed({
  get: () => localPeriodValue.value.split('-W')[0] || '',
  set: (value: string) => {
    const week = localPeriodValue.value.split('-W')[1] || ''
    localPeriodValue.value = value ? `${value}-W${week}` : ''
  }
})

const weekNumber = computed({
  get: () => localPeriodValue.value.split('-W')[1] || '',
  set: (value: string) => {
    const year = localPeriodValue.value.split('-W')[0] || ''
    localPeriodValue.value = value && year ? `${year}-W${value.padStart(2, '0')}` : ''
  }
})

// 当前周期的值
const currentYearValue = computed(() => getCurrentPeriodValue('YEAR'))
const currentMonthValue = computed(() => getCurrentPeriodValue('MONTH'))
const currentTaskValue = computed(() => getCurrentPeriodValue('TASK'))

// 周期标签
const periodLabel = computed(() => {
  if (!localPeriodType.value) return ''
  const labels: Record<string, string> = {
    YEAR: '年份',
    MONTH: '年月',
    WEEK: '年周',
    TASK: '任务日期'
  }
  return labels[localPeriodType.value] || '周期值'
})

// 监听外部变化
watch(() => props.periodType, (newType) => {
  localPeriodType.value = newType || ''
})

watch(() => props.periodValue, (newValue) => {
  localPeriodValue.value = newValue || ''
})

// 监听内部变化并触发更新
watch(localPeriodType, (newType) => {
  emit('update:periodType', newType)
})

watch(localPeriodValue, (newValue) => {
  emit('update:periodValue', newValue)
})

const handlePeriodTypeChange = () => {
  // 切换周期类型时，重置周期值或设置为当前周期
  if (localPeriodType.value) {
    setCurrentPeriod()
  } else {
    localPeriodValue.value = ''
  }
}

const setCurrentPeriod = () => {
  if (!localPeriodType.value) return
  localPeriodValue.value = getCurrentPeriodValue(localPeriodType.value as 'YEAR' | 'MONTH' | 'WEEK' | 'TASK')
}
</script>

<style scoped>
.period-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.field select,
.field input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.week-input {
  display: flex;
  gap: 0.5rem;
}

.week-input input {
  flex: 1;
}

.week-year {
  flex: 2;
}

.week-number {
  flex: 1;
}

.set-current-btn {
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.set-current-btn:hover {
  background: #c7d2fe;
}
</style>
