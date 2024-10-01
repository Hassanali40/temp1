import { AdminConfigResponse } from '../interfaces/adminConfig';
import ApiClient from './api';
import { API_URLS } from './routes';
const { ADMIN_CONFIG } = API_URLS;

export const defaultAdminConfig: AdminConfigResponse = Object.freeze({
  user_intent_sys_prompt: '',
  text_processing_tool_sys_prompt: '',
  answering_user_prompt: '',
  answering_sys_prompt: '',
});

export default class AdminConfigService {
  private static instance: AdminConfigService | null = null;
  client: ApiClient;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  static getInstance(): AdminConfigService {
    if (AdminConfigService.instance === null) {
      AdminConfigService.instance = new AdminConfigService();
    }
    return AdminConfigService.instance;
  }
  async getAdminConfigApi(profileId: string) {
    return this.client
      .get<AdminConfigResponse>(`${ADMIN_CONFIG}/${profileId}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        /* appInsightsException(error); */
        console.log('Error fetching admin config: ', error.message);
        return null;
      });
  }

  async saveAdminConfigApi(data: AdminConfigResponse) {
    return this.client
      .post<Response>(ADMIN_CONFIG, { body: JSON.stringify({ config: data }) })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        /* appInsightsException(error); */
        console.log('Error saving admin config: ', error.message);
        return null;
      });
  }
}
