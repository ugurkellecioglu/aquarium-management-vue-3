import { useFetch } from '@/composables/useFetch'
import { transformFishData } from '@/transformers/fishTransformer'
import { FishHealthStatus } from '@/types/fish'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useFishStore } from '../fish'
import { useSimulatorStore } from '../simulator'

const mockFetchReturn = {
  isFetching: ref(false),
  error: ref(undefined),
  data: ref(undefined),
  fetch: vi.fn(),
}

// Mock useFetch composable
vi.mock('@/composables/useFetch')

beforeEach(() => {
  setActivePinia(createPinia())
  // Reset all mocks
  vi.clearAllMocks()
  vi.mocked(useFetch).mockReturnValue(mockFetchReturn)
})

describe('Fish Store', () => {
  describe('feedFish', () => {
    it('successfully feeds fish with correct amount during feeding window', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      const mockFishData = [
        {
          id: 1,
          name: 'Nemo',
          type: 'Clownfish',
          weight: 100,
          feedingSchedule: {
            lastFeed: '12:00',
            intervalInHours: 12,
          },
        },
      ]
      const [transformedFishData] = transformFishData(mockFishData)

      // Setup initial state
      store.fish = [transformedFishData]

      const feedTime = transformedFishData.feedingSchedule.lastFeed
      simulator.currentTime = new Date(feedTime)
      // add 12 hours
      simulator.currentTime.setHours(simulator.currentTime.getHours() + 12)

      const recommendedAmount = store.getRecommendedPerMeal(transformedFishData)
      const result = store.feedFish(transformedFishData.id, recommendedAmount)

      expect(result).toBe(true)
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.GOOD)
      expect(store.fish[0].todayFeedingAmount).toBe(recommendedAmount)
    })

    it('worsens health when feeding with incorrect amount', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      const mockFishData = [
        {
          id: 1,
          name: 'Nemo',
          type: 'Clownfish',
          weight: 100,
          feedingSchedule: {
            lastFeed: '10:05',
            intervalInHours: 12,
          },
        },
      ]
      const [transformedFishData] = transformFishData(mockFishData)
      transformedFishData.healthStatus = FishHealthStatus.STANDARD
      store.fish = [transformedFishData]
      simulator.currentTime = new Date('2024-01-01T10:05:00')

      const incorrectAmount = store.getRecommendedPerMeal(transformedFishData) + 1
      const result = store.feedFish(transformedFishData.id, incorrectAmount)

      expect(result).toBe(false)
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.BAD)
    })

    it('prevents feeding dead fish', () => {
      const store = useFishStore()
      const mockFishData = [
        {
          id: 1,
          name: 'Nemo',
          type: 'Clownfish',
          weight: 100,
          feedingSchedule: {
            lastFeed: '10:05',
            intervalInHours: 12,
          },
        },
      ]
      const [transformedFishData] = transformFishData(mockFishData)
      transformedFishData.healthStatus = FishHealthStatus.DEAD

      store.fish = [transformedFishData]
      const result = store.feedFish(transformedFishData.id, 1)

      expect(result).toBe(false)
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.DEAD)
    })
  })

  describe('updateFishHealth', () => {
    it('worsens health when feeding is missed', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      const mockFishData = [
        {
          id: 1,
          name: 'Nemo',
          type: 'Clownfish',
          weight: 100,
          feedingSchedule: {
            lastFeed: '09:00',
            intervalInHours: 12,
          },
        },
      ]
      const [transformedFishData] = transformFishData(mockFishData)
      store.fish = [transformedFishData]
      // Set time past feeding window + buffer

      const futureDate = new Date(
        simulator.currentTime.getTime() + 12 * 60 * 60 * 1000 + 10 * 60 * 1000 + 1 * 1000,
      )

      simulator.currentTime = futureDate

      store.updateFishHealth()
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.BAD)
      expect(store.fish[0].skippedFeedings).toBe(1)
    })

    it('does not update health within feeding window', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      const mockFishData = [
        {
          id: 1,
          name: 'Nemo',
          type: 'Clownfish',
          weight: 100,
          feedingSchedule: {
            lastFeed: '09:00',
            intervalInHours: 12,
          },
        },
      ]
      const [transformedFishData] = transformFishData(mockFishData)

      transformedFishData.healthStatus = FishHealthStatus.STANDARD
      transformedFishData.feedingTimes = [new Date('2024-01-01T22:00:00').getTime()]
      transformedFishData.feedingSchedule = {
        lastFeed: new Date('2024-01-01T10:00:00').getTime(),
        intervalInHours: 12,
      }
      store.fish = [transformedFishData]
      simulator.currentTime = new Date('2024-01-01T22:05:00') // Within feeding window

      store.updateFishHealth()
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.STANDARD)
      expect(store.fish[0].skippedFeedings).toBe(0)
    })
  })

  describe('computed properties', () => {
    it('correctly determines if all fish are dead', async () => {
      const store = useFishStore()

      const mockFishData = [
        {
          id: 1,
          name: 'Nemo',
          type: 'Clownfish',
          weight: 100,
          feedingSchedule: {
            lastFeed: '09:00',
            intervalInHours: 12,
          },
        },
      ]

      store.fish = transformFishData(mockFishData)

      store.fish.forEach((fish) => {
        fish.healthStatus = FishHealthStatus.DEAD
      })
      expect(store.isAllFishDead).toBe(true)

      store.fish[0].healthStatus = FishHealthStatus.STANDARD

      expect(store.isAllFishDead).toBe(false)
    })
  })

  describe('feeding calculations', () => {
    const mockFishData = [
      {
        id: 1,
        name: 'Nemo',
        type: 'Clownfish',
        weight: 100,
        feedingSchedule: {
          lastFeed: '09:00',
          intervalInHours: 12,
        },
      },
    ]
    const [transformedFishData] = transformFishData(mockFishData)

    it('calculates recommended daily feeding amount', () => {
      const store = useFishStore()
      expect(store.getRecommendedDailyFeeding(transformedFishData)).toBe(1) // 1% of 100
    })

    it('calculates recommended per meal amount', () => {
      const store = useFishStore()
      expect(store.getRecommendedPerMeal(transformedFishData)).toBe(0.5) // 1/2 of daily amount
    })

    it('tracks daily feeding amount correctly across multiple feeds', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      store.fish = [transformedFishData]
      const recommendedPerMeal = store.getRecommendedPerMeal(transformedFishData)

      // Set initial time to first feeding window
      simulator.currentTime = new Date('2024-01-01T09:00:00')

      // First feeding
      store.feedFish(transformedFishData.id, recommendedPerMeal)
      expect(store.fish[0].todayFeedingAmount).toBe(recommendedPerMeal)

      // Move to next feeding window same day
      simulator.currentTime = new Date('2024-01-01T21:00:00')
      store.feedFish(transformedFishData.id, recommendedPerMeal)

      // Should accumulate both feedings
      expect(store.fish[0].todayFeedingAmount).toBe(recommendedPerMeal * 2)
      expect(store.fish[0].todayFeedingAmount).toBe(
        store.getRecommendedDailyFeeding(transformedFishData),
      )
    })
  })

  describe('updateFishTodayFeedingAmount', () => {
    it('resets feeding amounts when day changes', () => {
      const store = useFishStore()
      const mockFishData = [
        {
          id: 1,
          name: 'Nemo',
          type: 'Clownfish',
          weight: 100,
          feedingSchedule: {
            lastFeed: '09:00',
            intervalInHours: 12,
          },
        },
      ]
      const [transformedFishData] = transformFishData(mockFishData)
      transformedFishData.todayFeedingAmount = 1.5
      store.fish = [transformedFishData]

      // Same day - should not reset
      store.updateFishTodayFeedingAmount({
        currentTime: new Date('2024-01-01T23:59:59'),
        oldTime: new Date('2024-01-01T10:00:00'),
      })
      expect(store.fish[0].todayFeedingAmount).toBe(1.5)

      // Different day - should reset
      store.updateFishTodayFeedingAmount({
        currentTime: new Date('2024-01-02T00:00:00'),
        oldTime: new Date('2024-01-01T23:59:59'),
      })
      expect(store.fish[0].todayFeedingAmount).toBe(0)
    })
  })
})
