// useFish.ts
import { FEEDING_TEXT, HEALTH_STATUS, TIME_FORMAT } from '@/constants/text'
import { useFishStore } from '@/stores/fish'
import { useSimulatorStore } from '@/stores/simulator'
import type { ExtendedFish } from '@/types/fish'
import { FishHealthStatus } from '@/types/fish'
import { differenceInHours, differenceInMinutes, formatDistance } from 'date-fns'
import { tr } from 'date-fns/locale'
import { computed, ref } from 'vue'

export function useFish(fish: ExtendedFish) {
  const fishStore = useFishStore()
  const simulator = useSimulatorStore()

  const recommendedDailyFeeding = computed(() => fishStore.getRecommendedDailyFeeding(fish))

  const recommendedPerMeal = computed(() => fishStore.getRecommendedPerMeal(fish))

  const feedingAmount = ref(fishStore.getRecommendedPerMeal(fish))

  const healthStatus = computed(() => {
    const status = HEALTH_STATUS[fish.healthStatus]
    return {
      healthStatus: fish.healthStatus,
      text: `${status.emoji} ${status.text}`,
      class: `health-${fish.healthStatus.toLowerCase()}`,
    }
  })

  const timeSinceLastFeed = computed(() => {
    const currentTime = simulator.currentTime
    return formatDistance(new Date(fish.feedingSchedule.lastFeed), currentTime, {
      locale: tr,
    })
  })

  const isFishDead = computed(() => {
    return fish.healthStatus === FishHealthStatus.DEAD
  })

  const feedingAdvice = computed(() => {
    const currentTime = simulator.currentTime
    const nextFeedTime = new Date(
      fish.feedingSchedule.lastFeed + fish.feedingSchedule.intervalInHours * 60 * 60 * 1000,
    )

    const minutesUntilFeed = differenceInMinutes(nextFeedTime, currentTime)
    const hoursUntilFeed = differenceInHours(nextFeedTime, currentTime)
    const remainingMinutes = minutesUntilFeed % 60

    if (!remainingMinutes && hoursUntilFeed > 0) {
      return `${hoursUntilFeed} ${TIME_FORMAT.HOUR}`
    }

    if (hoursUntilFeed <= 0 && remainingMinutes <= 0) {
      return `${FEEDING_TEXT.TIME_TO_FEED}`
    }

    return `${hoursUntilFeed} ${TIME_FORMAT.HOUR} ${remainingMinutes} ${TIME_FORMAT.MINUTE}`
  })

  const todayFeedingAmount = computed(() => {
    return fish.todayFeedingAmount.toFixed(2)
  })

  function handleFeed() {
    fishStore.feedFish(fish.id, feedingAmount.value)
  }

  return {
    feedingAmount,
    recommendedDailyFeeding,
    recommendedPerMeal,
    healthStatus,
    timeSinceLastFeed,
    isFishDead,
    feedingAdvice,
    handleFeed,
    todayFeedingAmount,
  }
}
