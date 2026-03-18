<template>
  <component :is="icon" />
</template>

<script setup lang="ts">
import * as icons from './icons'

const props = defineProps<{
  name: string
}>()

const icon = icons[props.name as keyof typeof icons]
</script>
