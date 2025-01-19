import { describe, expect, it, vi } from 'vitest'
import { useFetch } from '../useFetch'

describe('useFetch', () => {
  it('handles successful fetch', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mockFetch = vi.fn().mockResolvedValue(mockData)

    const { fetch, data, error, isFetching } = useFetch(mockFetch)

    // Initial state
    expect(data.value).toBeUndefined()
    expect(error.value).toBeUndefined()
    expect(isFetching.value).toBe(false)

    // During fetch
    const fetchPromise = fetch()
    expect(isFetching.value).toBe(true)

    // After fetch
    const result = await fetchPromise
    expect(result).toEqual(mockData)
    expect(data.value).toEqual(mockData)
    expect(error.value).toBeUndefined()
    expect(isFetching.value).toBe(false)
  })

  it('handles fetch error with Error instance', async () => {
    const errorMessage = 'Fetch failed'
    const mockFetch = vi.fn().mockRejectedValue(new Error(errorMessage))

    const { fetch, data, error, isFetching } = useFetch(mockFetch)

    // Initial state
    expect(data.value).toBeUndefined()
    expect(error.value).toBeUndefined()
    expect(isFetching.value).toBe(false)

    // After failed fetch
    const result = await fetch()
    expect(result).toBeUndefined()
    expect(data.value).toBeUndefined()
    expect(error.value).toBe(errorMessage)
    expect(isFetching.value).toBe(false)
  })

  it('handles fetch error with non-Error instance', async () => {
    const mockFetch = vi.fn().mockRejectedValue('Unknown error')

    const { fetch, data, error, isFetching } = useFetch(mockFetch)

    // After failed fetch
    const result = await fetch()
    expect(result).toBeUndefined()
    expect(data.value).toBeUndefined()
    expect(error.value).toBe('Bir hata oluştu')
    expect(isFetching.value).toBe(false)
  })

  it('resets error on new fetch attempt', async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({ id: 1 })

    const { fetch, error, data } = useFetch(mockFetch)

    // First fetch fails
    await fetch()
    expect(error.value).toBe('First error')

    // Second fetch succeeds and clears error
    await fetch()
    expect(error.value).toBeUndefined()
    expect(data.value).toEqual({ id: 1 })
  })

  it('handles concurrent fetch calls properly', async () => {
    const mockFetch = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100)))

    const { fetch, isFetching } = useFetch(mockFetch)

    // Start multiple fetches
    const fetch1 = fetch()
    const fetch2 = fetch()

    expect(isFetching.value).toBe(true)

    // Wait for both to complete
    await Promise.all([fetch1, fetch2])
    expect(isFetching.value).toBe(false)
  })
})
