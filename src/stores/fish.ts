import { useFetch } from '@/composables/useFetch'
import { TEN_MINUTES_MS } from '@/constants/feeding'
import { fishService } from '@/services/fishService'
import { transformFishData } from '@/transformers/fishTransformer'
import type { ExtendedFish, Fish } from '@/types/fish'
import { FishHealthStatus } from '@/types/fish'
import {
  calculateFeedingTimes,
  improveHealthStatus,
  isWithinFeedingWindow,
  worsenHealthStatus,
} from '@/utils/fishUtils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSimulatorStore } from './simulator'

export const useFishStore = defineStore('fish', () => {
  const fish = ref<ExtendedFish[]>([])

  const { isFetching, error, data, fetch } = useFetch(fishService.fetchFish)

  /**
   * Fetches fish data asynchronously from the fishService
   * and transforms them into ExtendedFish objects.
   */
  async function fetchFish(): Promise<void> {
    const data = await fetch()
    if (!data) return
    fish.value = transformFishData(data)
  }

  function removeFeedingTime(fishId: number, feedingTime: number): void {
    const targetFish = fish.value.find((f) => f.id === fishId)
    if (!targetFish) {
      console.warn(`Fish with id ${fishId} not found`)
      return
    }
    targetFish.feedingTimes = targetFish.feedingTimes.filter((time) => time !== feedingTime)
  }

  /**
   * Feeds a specific fish by ID with a given amount.
   * Returns true if feeding was successful, false otherwise.
   */
  function feedFish(fishId: number, amount: number): boolean {
    const targetFish = fish.value.find((f) => f.id === fishId)
    if (!targetFish) {
      console.warn(`Fish with id ${fishId} not found`)
      return false
    }

    if (targetFish.healthStatus === FishHealthStatus.DEAD) {
      console.warn(`Cannot feed ${targetFish.name} because it is dead`)
      return false
    }

    const simulator = useSimulatorStore()
    const currentTime = simulator.currentTime.getTime()

    const recommendedAmount = getRecommendedPerMeal(targetFish)
    const amountIsExact = amount == recommendedAmount
    console.debug(`amountIsExact: ${amountIsExact}`)
    console.debug(`feedingTimes: ${targetFish.feedingTimes}`)
    // Validate whether we are within a valid feeding window
    const canFeed = targetFish.feedingTimes.some((feedingTime) => {
      return isWithinFeedingWindow(currentTime, feedingTime)
    })

    if (canFeed && amountIsExact) {
      targetFish.healthStatus = improveHealthStatus(targetFish.healthStatus)
      targetFish.skippedFeedings = 0
      targetFish.feedingSchedule.lastFeed = currentTime
      targetFish.feedingTimes = calculateFeedingTimes(targetFish)
      targetFish.todayFeedingAmount += amount

      removeFeedingTime(targetFish.id, currentTime)

      return true
    } else {
      if (targetFish.skippedFeedings == 1) {
        targetFish.skippedFeedings = 0
        targetFish.feedingSchedule.lastFeed = currentTime
        targetFish.feedingTimes = calculateFeedingTimes(targetFish)
        targetFish.todayFeedingAmount += amount
        return true
      }
      console.warn(
        `Cannot feed ${targetFish.name}; not time or amount is incorrect (expected ${recommendedAmount}) but ${amount} was fed and time is ${currentTime}`,
      )
      targetFish.healthStatus = worsenHealthStatus(targetFish.healthStatus)
      targetFish.skippedFeedings = 0
      targetFish.feedingSchedule.lastFeed = currentTime
      targetFish.todayFeedingAmount += amount
      return false
    }
  }

  /**
   * Periodically checks each fish to update its health based on missed feedings.
   * If fish is within a feeding window, it will not be penalized yet.
   */
  function updateFishHealth(): void {
    const simulator = useSimulatorStore()

    fish.value.forEach((currentFish) => {
      if (currentFish.healthStatus === FishHealthStatus.DEAD) return

      // Skip if within any feeding window
      const withinAnyFeedingWindow = currentFish.feedingTimes.some((feedingTime) =>
        isWithinFeedingWindow(simulator.currentTime.getTime(), feedingTime),
      )
      if (withinAnyFeedingWindow) return

      const lastFeedTime = new Date(currentFish.feedingSchedule.lastFeed).getTime()
      const intervalMs =
        currentFish.feedingSchedule.intervalInHours *
        60 *
        60 *
        1000 *
        (currentFish.skippedFeedings + 1)

      // If current time surpasses the expected feeding interval + buffer
      if (simulator.currentTime.getTime() - lastFeedTime + TEN_MINUTES_MS > intervalMs) {
        currentFish.healthStatus = worsenHealthStatus(currentFish.healthStatus)
        currentFish.skippedFeedings += 1
      }
    })
  }

  const isAllFishDead = computed(() => {
    return fish.value.every((fish) => fish.healthStatus === FishHealthStatus.DEAD)
  })

  /**
   * Returns basic feeding schedule info for a given fish,
   * including the last and next feed times and hours between feeds.
   */
  function getFeedingScheduleInfo(targetFish: Fish) {
    const simulator = useSimulatorStore()
    const currentTime = simulator.currentTime
    const lastFeed = new Date(targetFish.feedingSchedule.lastFeed)
    const nextFeed = new Date(
      lastFeed.getTime() + targetFish.feedingSchedule.intervalInHours * 60 * 60 * 1000,
    )

    return {
      feedingsPerDay: 24 / targetFish.feedingSchedule.intervalInHours,
      lastFeedTime: lastFeed,
      nextFeedTime: nextFeed,
      hoursSinceLastFeed: (currentTime.getTime() - lastFeed.getTime()) / (1000 * 60 * 60),
      hoursUntilNextFeed: (nextFeed.getTime() - currentTime.getTime()) / (1000 * 60 * 60),
    }
  }

  /**
   * Returns the recommended daily feeding amount, which is 1% of the fish's weight.
   */
  function getRecommendedDailyFeeding(fish: ExtendedFish): number {
    return Number((fish.weight * 0.01).toFixed(2))
  }

  /**
   * Returns the recommended per-meal feeding amount,
   * based on how many meals the fish has per day.
   */
  function getRecommendedPerMeal(fish: ExtendedFish): number {
    const mealsPerDay = 24 / fish.feedingSchedule.intervalInHours
    return Number((getRecommendedDailyFeeding(fish) / mealsPerDay).toFixed(2))
  }

  return {
    fish,
    isFetching,
    error,
    data,
    isAllFishDead,

    fetchFish,
    feedFish,
    updateFishHealth,

    getFeedingScheduleInfo,
    getRecommendedDailyFeeding,
    getRecommendedPerMeal,
  }
})
