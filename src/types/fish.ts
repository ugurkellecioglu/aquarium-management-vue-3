export interface FeedingSchedule {
  lastFeed: string
  intervalInHours: number
}

export enum FishHealthStatus {
  DEAD = 'DEAD',
  BAD = 'BAD',
  STANDARD = 'STANDARD',
  GOOD = 'GOOD',
}

export interface Fish {
  id: number
  type: string
  name: string
  weight: number // in grams
  feedingSchedule: FeedingSchedule
}

export interface ExtendedFish extends Omit<Fish, 'feedingSchedule'> {
  feedingTimes: number[]
  skippedFeedings: number
  healthStatus: FishHealthStatus
  feedingSchedule: Omit<FeedingSchedule, 'lastFeed'> & { lastFeed: number }
  dailyFeedingTotal: number
  todayFeedingAmount: number
}
