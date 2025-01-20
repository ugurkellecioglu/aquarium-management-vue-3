<script setup lang="ts">
const emit = defineEmits(['onClick'])

defineProps<{
  title: string
  actionText: string
}>()
</script>

<template>
  <div class="p-4 my-4 bg-red-50 text-red-700 rounded-lg border border-red-200" role="alert">
    <div class="font-medium">{{ title }}</div>
    <div class="mt-1">
      <slot />
    </div>
    <button
      @click="emit('onClick')"
      class="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
    >
      {{ actionText }}
    </button>
  </div>
</template>
