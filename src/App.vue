<script setup lang="ts">
import FishTank from '@/components/fish-container/FishTank.vue'
import FishTable from '@/components/fish-datatable/FishTable.vue'
import { useFishStore } from '@/stores/fish'
import { useSimulatorStore } from '@/stores/simulator'
import { toRefs, watch } from 'vue'

const simulator = useSimulatorStore()
const fishStore = useFishStore()
const { fish } = toRefs(fishStore)
const { updateFishHealth, fetchFish } = fishStore

watch(() => simulator.currentTime, updateFishHealth)

fetchFish()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1">
      <div class="app-container">
        <div class="content">
          <div class="min-h-screen bg-gray-50">
            <div
              class="fixed !z-50 sm:translate-x-0 sm:right-8 sm:top-1/2 sm:-translate-y-1/2 bottom-4 left-1/2 sm:left-[initial] -translate-x-1/2"
            >
              <GameControls />
            </div>
            ;

            <div class="container mx-auto px-5 max-w-7xl py-8">
              <!-- Header -->
              <header class="mb-8">
                <h1 class="text-4xl font-bold text-center text-gray-800">Balık Takip Sistemi</h1>
              </header>

              <!-- Main Content -->
              <main class="space-y-8">
                <FishTank />
                <FishTable :fish="fish" />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Health status colors */
.health-good {
  @apply text-green-700;
}

.health-standard {
  @apply text-orange-600;
}

.health-bad {
  @apply text-red-700;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}
</style>
