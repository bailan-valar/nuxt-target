<template>
  <div class="period-selector">
      <div class="label-header">
      <label for="period-type">周期设置</label>
        <button
          type="button"
          @click="setCurrentPeriod"
          class="set-current-btn"
          title="设置为当前周期"
        >
          设为当前
        </button>
      </div>
    <div class="period-inputs">
      <div class="period-type-wrapper field">
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
          <option value="CUSTOM">自定义周期</option>
        </select>
      </div>

      <div v-if="localPeriodType === 'CUSTOM'" class="period-value-wrapper field">
        <div class="custom-period-hint">
          请在下方的"时间规划"中设置计划开始与结束时间
        </div>
      </div>

      <div v-else-if="localPeriodType" class="period-value-wrapper field">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentPeriodValue } from '~/lib/validations/period-utils'

type PeriodType = 'YEAR' | 'MONTH' | 'WEEK' | 'TASK' | 'CUSTOM' | ''

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
    TASK: '任务日期',
    CUSTOM: '自定义周期'
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
  // 自定义周期不需要设置 periodValue
  if (localPeriodType.value === 'CUSTOM') {
    localPeriodValue.value = 'CUSTOM'
    return
  }
  localPeriodValue.value = getCurrentPeriodValue(localPeriodType.value as 'YEAR' | 'MONTH' | 'WEEK' | 'TASK')
}
</script>

<style scoped>
.period-selector {
  display: flex;
  flex-direction: column;
  gap: 0.325rem;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.625rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
}

.field select,
.field input {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.8125rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: white;
}

.field select:focus,
.field input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.period-inputs {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.period-type-wrapper {
  flex-shrink: 0;
  width: 120px;
}

.period-value-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.period-value-wrapper .week-input {
  width: 100%;
}

.label-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label-header label {
  display: block;
  margin-bottom: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
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
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: #f3f4f6;
  color: #374151;
}

.set-current-btn:hover {
  background: #e5e7eb;
}

.custom-period-hint {
  padding: 0.5rem 0.625rem;
  background: #eff6ff;
  border: 1px dashed #3b82f6;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #1e40af;
  line-height: 1.4;
}
</style>
