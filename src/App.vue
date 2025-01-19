<script setup lang="ts">
import FishTank from '@/components/fish-container/FishTank.vue'
import FishTable from '@/components/fish-datatable/FishTable.vue'
import { useFishStore } from '@/stores/fish'
import { useSimulatorStore } from '@/stores/simulator'
import { computed, toRefs, watch } from 'vue'

// Store setup
const simulator = useSimulatorStore()
const fishStore = useFishStore()
const { isFetching, error, fish, isAllFishDead } = toRefs(fishStore)
const { updateFishHealth, fetchFish } = fishStore

// Watch fish health when time changes
watch(() => simulator.currentTime, updateFishHealth)

// Watch for all fish dying
watch(isAllFishDead, (allDead) => {
  if (allDead) {
    simulator.stopSimulation()
  }
})

// Computed properties for better reactivity and readability
const showLoading = computed(() => isFetching.value)
const showError = computed(() => error.value)
const showContent = computed(() => !isFetching.value && !error.value)

// Fetch fish data on component mount
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

              <!-- Loading State -->
              <Loading v-if="showLoading" />
              <Error
                v-else-if="showError"
                title="Bir hata oluştu"
                actionText="Tekrar Dene"
                @onClick="fetchFish"
              />
              <main v-else-if="showContent" class="space-y-8">
                <FishTank />
                <FishTable :fish="fish" />
              </main>
            </div>
          </div>
        </div>
        <!-- Add padding bottom for mobile to prevent overlap with fixed controls -->
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
