<script setup lang="ts">
import PauseIcon from '@/components/icons/PauseIcon.vue'
import PlayIcon from '@/components/icons/PlayIcon.vue'
import { useSimulatorStore } from '@/stores/simulator'
import GameClock from './GameClock.vue'
import SpeedControls from './SpeedControls.vue'
const simulator = useSimulatorStore()
</script>

<template>
  <div
    class="!z-50 bg-white border border-gray-200 w-min rounded-lg p-4 shadow-lg transition-opacity duration-200"
  >
    <div class="flex flex-col items-center gap-4">
      <!-- Game Clock Section -->
      <div class="flex-none">
        <GameClock />
      </div>

      <!-- Controls Section -->
      <div class="flex flex-1 flex-col items-center gap-3">
        <!-- Control Buttons -->
        <div class="flex gap-2">
          <button
            @click="simulator.startSimulation"
            :disabled="simulator.isRunning"
            class="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <PlayIcon class="w-4 h-4 mr-1" />
            Başlat
          </button>

          <button
            @click="simulator.stopSimulation"
            :disabled="!simulator.isRunning"
            class="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <PauseIcon class="w-4 h-4 mr-1" />
            Durdur
          </button>
        </div>

        <!-- Speed Controls -->
        <div class="flex-1">
          <SpeedControls :disabled="!simulator.isRunning" />
        </div>
      </div>
    </div>
  </div>
</template>
