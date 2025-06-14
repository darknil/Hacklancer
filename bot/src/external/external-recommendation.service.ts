import axios from 'axios'
export class ExternalRecommendationService {
  private baseUrl: string
  constructor() {
    this.baseUrl = `http://${process.env.RECOMMENDATION_SERVICE_HOST}:3000`
  }
  async fetchRecommendations(chatId: number): Promise<number[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/recommendation/next?chatId=${chatId}`
      )
      return response.data
    } catch (error) {
      console.log('Error fetching recommendations:', error)
      return []
    }
  }
}
