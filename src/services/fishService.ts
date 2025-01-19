import apiClient from '@/plugins/apiClient'
import type { FishApiResponse } from '@/types/api'

// class-based service for best practices
class FishService {
  public async fetchFish() {
    const response = await apiClient.get<FishApiResponse>('/e80be173-df55-404b-833b-670e53a4743d')
    if (response.status !== 200) {
      throw new Error('Balıklar yüklenemedi')
    }
    if (!response.data) {
      throw new Error('Balıklar yüklenemedi')
    }

    return response.data
  }
}

export const fishService = new FishService()
