import { UserData } from '../interfaces/user';
import ApiClient from './api';
import { API_URLS } from './routes';
const { USER } = API_URLS;

export default class UserDataService {
  private static instance: UserDataService | null = null;
  client: ApiClient;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  static getInstance(): UserDataService {
    if (UserDataService.instance === null) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  async getUser() {
    try {
      const response = await this.client.get<UserData>(USER);
      return response;
    } catch (error) {
      console.log('Error fetching user information: ', error);
      return null;
    }
  }

  async updateUser(params?: UserData) {
    return this.client
      .post<UserData>(USER, { params })
      .then((response) => {
        const data = { ...response, wasLoaded: true };
        return data;
      })
      .catch((error) => {
        /*appInsightsException(error);*/
        console.log('Error updating the user: ', error.message);
        return null;
      });
  }
}
