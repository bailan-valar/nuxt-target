<template>
  <div class="notes-page">
    <div class="notes-container">
      <NoteList />
    </div>
  </div>
</template>

<script setup lang="ts">
import NoteList from '~/components/NoteList.vue'

definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
.notes-page {
  @apply min-h-screen bg-gray-50;
}

.notes-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8;
}
</style>
