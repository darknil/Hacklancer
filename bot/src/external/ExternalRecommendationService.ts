export class ExternalRecommendationService {
  private baseUrl: string
  constructor() {
    this.baseUrl = `http://${process.env.RECOMMENDATION_SERVICE_HOST}:3000`
  }
}
