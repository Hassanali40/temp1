import { IValidateSession } from '../interfaces/validate';
import ApiClient from './api';
import { API_URLS } from './routes';

export default class ValidateSessionService {
  private static instance: ValidateSessionService | null = null;
  client: ApiClient;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  static getInstance(): ValidateSessionService {
    if (ValidateSessionService.instance === null) {
      ValidateSessionService.instance = new ValidateSessionService();
    }
    return ValidateSessionService.instance;
  }

  async getPing(): Promise<boolean> {
    return this.client
      .get<IValidateSession>(API_URLS.PING)
      .then((response) => {
        return response.status === 'OK';
      })
      .catch(() => {
        return false;
      });
  }

  async validSessionCheck() {
    if (await this.getPing()) {
      /* let user = dataStore.get("user");
        appInsightsEvent({ name: "Login timeout", properties: { user } }); */
      console.log('reloading ', window.location.href);
      window.location.reload();
    }
  }
}
