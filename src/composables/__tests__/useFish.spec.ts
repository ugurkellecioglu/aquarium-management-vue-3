import { FEEDING_TEXT } from '@/constants/text'
import { FishHealthStatus } from '@/types/fish'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFish } from '../useFish'

// Mock stores
vi.mock('@/stores/fish', () => ({
  useFishStore: vi.fn(() => ({
    getRecommendedDailyFeeding: vi.fn().mockReturnValue(10),
    getRecommendedPerMeal: vi.fn().mockReturnValue(2),
    feedFish: vi.fn(),
    $state: {},
    $patch: vi.fn(),
    $reset: vi.fn(),
    $subscribe: vi.fn(),
    $dispose: vi.fn(),
    $id: 'fish',
  })),
}))

vi.mock('@/stores/simulator', () => ({
  useSimulatorStore: vi.fn(() => ({
    currentTime: new Date('2024-03-20T12:00:00'),
  })),
}))

describe('useFish', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  const mockFish = {
    id: 1,
    name: 'Nemo',
    type: 'Clownfish',
    weight: 100,
    healthStatus: FishHealthStatus.GOOD,
    feedingSchedule: {
      lastFeed: new Date('2024-03-20T10:00:00').getTime(),
      intervalInHours: 12,
    },
    feedingTimes: [],
    skippedFeedings: 0,
    dailyFeedingTotal: 3,
    todayFeedingAmount: 5.5,
  }

  it('should compute health status correctly', () => {
    const { healthStatus } = useFish(mockFish)

    expect(healthStatus.value).toEqual({
      healthStatus: FishHealthStatus.GOOD,
      text: '😊 İyi',
      class: 'health-good',
    })
  })

  it('should compute time since last feed', () => {
    const { timeSinceLastFeed } = useFish(mockFish)
    expect(timeSinceLastFeed.value).toBeTruthy()
  })

  it('should determine if fish is dead', () => {
    const { isFishDead } = useFish(mockFish)
    expect(isFishDead.value).toBe(false)

    const deadFish = { ...mockFish, healthStatus: FishHealthStatus.DEAD }
    const { isFishDead: deadFishStatus } = useFish(deadFish)
    expect(deadFishStatus.value).toBe(true)
  })

  it('should compute feeding advice when its time to feed', () => {
    const fishNeedingFood = {
      ...mockFish,
      feedingSchedule: {
        lastFeed: new Date('2024-03-20T08:00:00').getTime(),
        intervalInHours: 4,
      },
    }
    const { feedingAdvice } = useFish(fishNeedingFood)
    expect(feedingAdvice.value).toBe(FEEDING_TEXT.TIME_TO_FEED)
  })

  it('should compute feeding advice with remaining time', () => {
    // Test case for hours and minutes
    const fishRecentlyFed = {
      ...mockFish,
      feedingSchedule: {
        lastFeed: new Date('2024-03-20T11:30:00').getTime(),
        intervalInHours: 4,
      },
    }
    const { feedingAdvice } = useFish(fishRecentlyFed)
    expect(feedingAdvice.value).toMatch(/\d+.*saat.*\d+.*dakika/)

    // Test case for only hours
    const fishWithFullHours = {
      ...mockFish,
      feedingSchedule: {
        lastFeed: new Date('2024-03-20T11:00:00').getTime(),
        intervalInHours: 4,
      },
    }
    const { feedingAdvice: fullHoursAdvice } = useFish(fishWithFullHours)
    expect(fullHoursAdvice.value).toMatch(/\d+.*saat/)
  })

  it('should format today feeding amount correctly', () => {
    const { todayFeedingAmount } = useFish(mockFish)
    expect(todayFeedingAmount.value).toBe('5.50')
  })

  it('should compute recommended values', () => {
    const { recommendedDailyFeeding, recommendedPerMeal } = useFish(mockFish)

    expect(recommendedDailyFeeding.value).toBe(10)
    expect(recommendedPerMeal.value).toBe(2)
  })
})
