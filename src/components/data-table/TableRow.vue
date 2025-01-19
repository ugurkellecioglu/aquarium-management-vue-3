<script lang="ts" setup>
import { useFish } from '@/composables/useFish'
import { useSimulatorStore } from '@/stores/simulator'
import type { ExtendedFish } from '@/types/fish'
import { toRefs } from 'vue'

interface Props {
  fish: ExtendedFish
}
const props = defineProps<Props>()
const {
  feedingAmount,
  recommendedDailyFeeding,
  recommendedPerMeal,
  healthStatus,
  timeSinceLastFeed,
  isFishDead,
  feedingAdvice,
  todayFeedingAmount,
  handleFeed,
} = useFish(props.fish)

const { isRunning } = toRefs(useSimulatorStore())
</script>

<template>
  <tr class="border-b border-gray-200 hover:bg-gray-100">
    <td class="p-4 text-sm font-medium text-gray-700">{{ fish.name }}</td>
    <td class="p-4 text-sm text-gray-600">{{ fish.type }}</td>
    <td class="p-4 text-sm text-gray-600">{{ fish.weight }}g</td>
    <td class="p-4 text-sm text-gray-600">{{ fish.feedingSchedule.intervalInHours }} saat</td>
    <td class="p-4 text-sm text-gray-600">{{ recommendedDailyFeeding }}g/gün</td>
    <td class="p-4 text-sm text-gray-600">{{ recommendedPerMeal }}g/öğün</td>
    <td class="p-4 text-sm text-gray-600">{{ todayFeedingAmount }}g</td>
    <td class="p-4 text-sm text-gray-600">{{ timeSinceLastFeed }}</td>
    <td class="p-4 text-sm text-gray-600">
      <span v-if="!isFishDead">{{ feedingAdvice }}</span>
      <span v-else>-</span>
    </td>
    <td class="p-4 text-sm">
      <span :class="healthStatus.class" class="rounded-full px-3 py-1 text-xs font-semibold">{{
        healthStatus.text
      }}</span>
    </td>
    <td class="p-4">
      <div class="flex flex-col items-start space-y-2">
        <div class="flex items-center space-x-2">
          <input
            type="number"
            v-model="feedingAmount"
            class="w-16 border border-gray-300 rounded-lg p-2 text-sm focus:ring focus:ring-blue-200 focus:outline-none disabled:opacity-50"
            :disabled="!isRunning || isFishDead"
            :step="0.1"
            :min="0"
          />
          <span class="text-sm text-gray-700">g</span>
          <button
            @click="handleFeed"
            class="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50"
            :disabled="!isRunning || isFishDead"
          >
            Besle
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped>
tr {
  transition: background-color 0.2s;
}
</style>
