import ApiClient from './api';
import { API_URLS } from './routes';
import { ITokenResponse } from '../interfaces/speech';

const { SPEECH_TOKEN } = API_URLS;

export default class SpeechService {
  private static instance: SpeechService | null = null;
  client: ApiClient;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  static getInstance(): SpeechService {
    if (SpeechService.instance === null) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  async getSpeechToken() {
    try {
      return this.client.get<ITokenResponse>(SPEECH_TOKEN);
    } catch (_error) {
      console.log('Error getting toke ...');
    }
  }
}
