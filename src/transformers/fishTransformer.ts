import { FishHealthStatus, type ExtendedFish, type Fish } from '@/types/fish'
import { calculateFeedingTimes } from '@/utils/fishUtils'

export function transformFishData(fishData: Fish[]): ExtendedFish[] {
  return fishData.map((fish) => {
    const today = new Date()
    const [hours, minutes] = fish.feedingSchedule.lastFeed.split(':').map(Number)

    // Set the time
    today.setHours(hours, minutes, 0, 0)

    const lastFeed = today.getTime()

    const transformedFish = {
      ...fish,
      feedingTimes: [],
      healthStatus: FishHealthStatus.STANDARD,
      skippedFeedings: 0,
      dailyFeedingTotal: 0,
      feedingSchedule: {
        ...fish.feedingSchedule,
        lastFeed,
      },
      todayFeedingAmount: 0,
    } as ExtendedFish
    transformedFish.feedingTimes = calculateFeedingTimes(transformedFish)

    return transformedFish
  })
}
