import { ref } from 'vue'

export function useFetch<T>(fetchFunction: () => Promise<T>) {
  const isFetching = ref(false)
  const error = ref<string>()
  const data = ref<T | undefined>()

  async function fetch(): Promise<T | undefined> {
    isFetching.value = true
    error.value = undefined

    try {
      const result = await fetchFunction()
      data.value = result
      return result
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Bir hata oluştu'
      }
      return undefined
    } finally {
      isFetching.value = false
    }
  }

  return {
    isFetching,
    error,
    data,
    fetch,
  }
}
