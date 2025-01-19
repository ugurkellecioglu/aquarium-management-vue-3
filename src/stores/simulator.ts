import type { SimulationSpeed } from '@/constants/simulation'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const now = new Date()
const SIMULATOR_START_TIME = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0)

export const useSimulatorStore = defineStore('simulator', () => {
  const currentTime = ref(SIMULATOR_START_TIME)
  const speed = ref<SimulationSpeed>(1)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const intervalId = ref<number | null>(null)

  const formattedTime = computed(() => {
    return currentTime.value.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  })

  function startSimulation() {
    if (isRunning.value) return

    isRunning.value = true
    isPaused.value = false

    // Start the interval if not already started
    if (intervalId.value === null) {
      intervalId.value = window.setInterval(() => {
        // Only increment time if running and not paused
        if (isRunning.value && !isPaused.value) {
          const increment = 1000 * speed.value
          currentTime.value = new Date(currentTime.value.getTime() + increment)
        }
      }, 1000)
    }
  }

  function stopSimulation() {
    if (intervalId.value) {
      window.clearInterval(intervalId.value)
      intervalId.value = null
    }
    isRunning.value = false
    isPaused.value = false
  }

  function setSpeed(newSpeed: SimulationSpeed) {
    speed.value = newSpeed
  }

  function pauseSimulation() {
    // Only pause if we're actually running
    if (!isRunning.value) return
    isPaused.value = true
  }

  function resumeSimulation() {
    // Only resume if we're actually running
    if (!isRunning.value) return
    isPaused.value = false
  }

  function setTime(time: Date) {
    currentTime.value = time
  }

  return {
    currentTime,
    speed,
    isRunning,
    intervalId,
    isPaused,

    formattedTime,

    startSimulation,
    stopSimulation,
    setSpeed,
    pauseSimulation,
    resumeSimulation,
    setTime,
  }
})
