import { TEN_MINUTES_MS } from '@/constants/feeding'
import { FishHealthStatus } from '@/types/fish'

/**
 * Determines if the current time is within ± TEN_MINUTES_MS of a given feeding time.
 */
export function isWithinFeedingWindow(currentTime: number, feedingTime: number): boolean {
  const min = feedingTime - TEN_MINUTES_MS
  const max = feedingTime + TEN_MINUTES_MS
  return currentTime >= min && currentTime <= max
}

/**
 * Improves the fish's health status one level up if possible.
 */
export function improveHealthStatus(status: FishHealthStatus): FishHealthStatus {
  switch (status) {
    case FishHealthStatus.BAD:
      return FishHealthStatus.STANDARD
    case FishHealthStatus.STANDARD:
      return FishHealthStatus.GOOD
    default:
      return status
  }
}

/**
 * Worsens the fish's health status one level down if possible.
 */
export function worsenHealthStatus(status: FishHealthStatus): FishHealthStatus {
  switch (status) {
    case FishHealthStatus.GOOD:
      return FishHealthStatus.STANDARD
    case FishHealthStatus.STANDARD:
      return FishHealthStatus.BAD
    case FishHealthStatus.BAD:
      return FishHealthStatus.DEAD
    default:
      return status
  }
}
