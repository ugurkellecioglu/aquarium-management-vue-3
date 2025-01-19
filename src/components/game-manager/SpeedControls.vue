<script setup lang="ts">
import GaugeIcon from '@/components/icons/GaugeIcon.vue'
import { SPEED_PRESETS } from '@/constants/simulation'
import { useSimulatorStore } from '@/stores/simulator'
import { computed } from 'vue'

interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const simulator = useSimulatorStore()
const currentSpeed = computed(() => simulator.speed)

const handleSpeedChange = (speed: (typeof SPEED_PRESETS)[number]['value']) => {
  simulator.setSpeed(speed)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center text-gray-700 text-sm font-medium">
      <GaugeIcon class="w-4 h-4 mr-1" />
      Hız:
    </div>
    <div class="flex items-center gap-1">
      <button
        v-for="preset in SPEED_PRESETS"
        :key="preset.value"
        @click="handleSpeedChange(preset.value)"
        :disabled="props.disabled"
        class="px-2 py-1 text-xs font-medium rounded transition-colors"
        :class="[
          currentSpeed === preset.value
            ? 'bg-emerald-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>
