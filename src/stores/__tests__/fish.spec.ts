import { useFetch } from '@/composables/useFetch'
import { transformFishData } from '@/transformers/fishTransformer'
import { Fish, FishHealthStatus } from '@/types/fish'
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
  describe('fetchFish', () => {
    it('fetches and transforms fish data successfully', async () => {
      const mockDate = new Date('2024-01-01T10:00:00')
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
      ] as Fish[]

      const transformedFishData = transformFishData(mockFishData)

      const mockFetch = vi.fn().mockResolvedValue(transformedFishData)
      vi.mocked(useFetch).mockReturnValue({
        fetch: mockFetch,
        data: ref(undefined),
        error: ref(undefined),
        isFetching: ref(false),
      })

      const store = useFishStore()
      await store.fetchFish()

      expect(store.fish[0]).toEqual({
        ...mockFishData[0],
        healthStatus: FishHealthStatus.STANDARD,
        skippedFeedings: 0,
        todayFeedingAmount: 0,
        feedingTimes: [
          mockDate.getTime(),
          new Date(mockDate.getTime() + 12 * 60 * 60 * 1000).getTime(),
        ],
      })
    })

    it('handles fetch failure gracefully', async () => {
      const mockFetch = vi.fn().mockResolvedValue(undefined)
      vi.mocked(useFetch).mockReturnValue({
        fetch: mockFetch,
        data: ref(undefined),
        error: ref('Error'),
        isFetching: ref(false),
      })

      const store = useFishStore()
      await store.fetchFish()
      expect(store.fish).toHaveLength(0)
    })
  })

  describe('feedFish', () => {
    const mockFish = {
      id: 1,
      name: 'Nemo',
      species: 'Clownfish',
      weight: 100,
      healthStatus: FishHealthStatus.HEALTHY,
      skippedFeedings: 0,
      todayFeedingAmount: 0,
      feedingSchedule: {
        lastFeed: new Date('2024-01-01T10:00:00').toISOString(),
        intervalInHours: 12,
      },
      feedingTimes: [
        new Date('2024-01-01T10:00:00').getTime(), // 10:00 feeding time
        new Date('2024-01-01T22:00:00').getTime(), // 22:00 feeding time
      ],
    }

    it('successfully feeds fish with correct amount during feeding window', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      // Setup initial state
      store.fish = [mockFish]
      simulator.currentTime = new Date('2024-01-01T10:05:00') // Within 10:00 feeding window

      const recommendedAmount = store.getRecommendedPerMeal(mockFish)
      const result = store.feedFish(mockFish.id, recommendedAmount)

      expect(result).toBe(true)
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.HEALTHY)
      expect(store.fish[0].todayFeedingAmount).toBe(recommendedAmount)
    })

    it('worsens health when feeding with incorrect amount', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      store.fish = [mockFish]
      simulator.currentTime = new Date('2024-01-01T10:05:00')

      const incorrectAmount = store.getRecommendedPerMeal(mockFish) + 1
      const result = store.feedFish(mockFish.id, incorrectAmount)

      expect(result).toBe(false)
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.SICK)
    })

    it('prevents feeding dead fish', () => {
      const store = useFishStore()
      const deadFish = { ...mockFish, healthStatus: FishHealthStatus.DEAD }

      store.fish = [deadFish]
      const result = store.feedFish(deadFish.id, 1)

      expect(result).toBe(false)
    })
  })

  describe('updateFishHealth', () => {
    it('worsens health when feeding is missed', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      const mockFish = {
        id: 1,
        healthStatus: FishHealthStatus.STANDARD,
        skippedFeedings: 0,
        feedingSchedule: {
          lastFeed: '09:00',
          intervalInHours: 12,
        },
        feedingTimes: [],
      }

      store.fish = [mockFish]
      // Set time past feeding window + buffer
      simulator.currentTime = new Date('2024-01-01T22:11:00') // 12 hours + 10 minutes + 1 minute

      store.updateFishHealth()
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.SICK)
      expect(store.fish[0].skippedFeedings).toBe(1)
    })

    it('does not update health within feeding window', () => {
      const store = useFishStore()
      const simulator = useSimulatorStore()

      const mockFish = {
        id: 1,
        healthStatus: FishHealthStatus.HEALTHY,
        skippedFeedings: 0,
        feedingSchedule: {
          lastFeed: new Date('2024-01-01T10:00:00').toISOString(),
          intervalInHours: 12,
        },
        feedingTimes: [new Date('2024-01-01T22:00:00').getTime()],
      }

      store.fish = [mockFish]
      simulator.currentTime = new Date('2024-01-01T22:05:00') // Within feeding window

      store.updateFishHealth()
      expect(store.fish[0].healthStatus).toBe(FishHealthStatus.HEALTHY)
      expect(store.fish[0].skippedFeedings).toBe(0)
    })
  })

  describe('computed properties', () => {
    it('correctly determines if all fish are dead', () => {
      const store = useFishStore()

      store.fish = [
        { id: 1, healthStatus: FishHealthStatus.DEAD },
        { id: 2, healthStatus: FishHealthStatus.DEAD },
      ]
      expect(store.isAllFishDead).toBe(true)

      store.fish = [
        { id: 1, healthStatus: FishHealthStatus.DEAD },
        { id: 2, healthStatus: FishHealthStatus.SICK },
      ]
      expect(store.isAllFishDead).toBe(false)
    })
  })

  describe('feeding calculations', () => {
    const mockFish = {
      id: 1,
      weight: 100,
      feedingSchedule: { intervalInHours: 12 },
    }

    it('calculates recommended daily feeding amount', () => {
      const store = useFishStore()
      expect(store.getRecommendedDailyFeeding(mockFish)).toBe(1) // 1% of 100
    })

    it('calculates recommended per meal amount', () => {
      const store = useFishStore()
      expect(store.getRecommendedPerMeal(mockFish)).toBe(0.5) // 1/2 of daily amount
    })
  })
})
