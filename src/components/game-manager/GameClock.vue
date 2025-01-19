<script setup lang="ts">
import ClockIcon from '@/components/icons/ClockIcon.vue'
import { useSimulatorStore } from '@/stores/simulator'
import { computed } from 'vue'

const simulator = useSimulatorStore()

const timeSegments = computed(() => {
  const timeOnly = simulator.formattedTime.split(' ')[1]
  const [hours, minutes, seconds] = timeOnly.split(':')
  return { hours, minutes, seconds }
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <ClockIcon class="w-4 h-4 text-gray-600" />
    <div class="text-gray-700 text-sm font-medium">Zaman:</div>
    <div class="flex items-center text-lg font-bold tracking-wider">
      <div
        class="w-10 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center"
      >
        <div class="flex items-center justify-center text-emerald-600">
          {{ timeSegments.hours }}
        </div>
      </div>

      <div class="mx-1 text-gray-400">:</div>

      <div
        class="w-10 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center"
      >
        <div class="flex items-center justify-center text-emerald-600">
          {{ timeSegments.minutes }}
        </div>
      </div>

      <div class="mx-1 text-gray-400">:</div>

      <div
        class="w-10 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center"
      >
        <div class="flex items-center justify-center text-emerald-600">
          {{ timeSegments.seconds }}
        </div>
      </div>
    </div>
  </div>
</template>
