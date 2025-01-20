<script setup lang="ts">
import FishTable from '@/components/data-table/FishTable.vue'
import FishTank from '@/components/fish-tank/FishTank.vue'
import GameControls from '@/components/game-manager/GameControls.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import GameOver from '@/components/layout/GameOver.vue'
import { useFishStore } from '@/stores/fish'
import { useSimulatorStore } from '@/stores/simulator'
import { computed, onMounted, toRefs, watch } from 'vue'
import AppError from './components/layout/AppError.vue'
import AppLoading from './components/layout/AppLoading.vue'

const { currentTime, stopSimulation } = toRefs(useSimulatorStore())
const fishStore = useFishStore()

const { isFetching, error, fish, isAllFishDead } = toRefs(fishStore)
const { updateFishHealth, fetchFish, updateFishTodayFeedingAmount } = fishStore

const showLoading = computed(() => isFetching.value)
const showError = computed(() => error.value)
const showContent = computed(() => !isFetching.value && !error.value)

watch(currentTime, (newValue, oldValue) => {
  updateFishHealth()
  updateFishTodayFeedingAmount({ currentTime: newValue, oldTime: oldValue })
})

watch(isAllFishDead, (allDead) => {
  if (allDead) {
    stopSimulation.value()
  }
})

onMounted(() => {
  fetchFish()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1">
      <div class="app-container">
        <div class="content">
          <div class="min-h-screen bg-gray-50">
            <div
              class="h-fit fixed z-max sm:translate-x-0 sm:right-8 sm:top-1/2 sm:-translate-y-1/2 bottom-4 left-1/2 sm:left-[initial] -translate-x-1/2"
            >
              <GameControls />
            </div>

            <div class="container mx-auto px-5 max-w-7xl py-8">
              <!-- Header -->
              <header class="mb-8">
                <h1 class="text-4xl font-bold text-center text-gray-800">Balık Takip Sistemi</h1>
              </header>

              <!-- Loading State -->
              <AppLoading v-if="showLoading" />
              <AppError
                v-else-if="showError"
                title="Bir hata oluştu"
                actionText="Tekrar Dene"
                @onClick="fetchFish"
              />
              <main v-else-if="showContent" class="space-y-8">
                <FishTank />
                <FishTable :fish="fish" />
                <GameOver v-if="isAllFishDead" />
              </main>
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}
</style>
