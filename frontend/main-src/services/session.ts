import ValidateSessionService from './validateSession';
import ApiClient from './api';
import { Session } from '../interfaces/session';
import { API_URLS } from './routes';

const { SESSION } = API_URLS;

export const defaultSession: Session = Object.freeze({
  id: '-1',
  name: 'New Patient',
  created: 0,
  updated: 0,
  qas: [],
  error: '',
  isLoading: false,
  wasLoaded: false,
  isWaiting: false,
  isStreaming: false,
  taskId: '',
  agentsStatus: [],
  isQuerying: false,
  inputText: '',
  inputPromptId: '',
  currentRecordingTimer: 0,
});

export default class SessionService {
  private static instance: SessionService | null = null;
  client: ApiClient;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  static getInstance(): SessionService {
    if (SessionService.instance === null) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async getSession(session_id: string) {
    return this.client
      .get<Session>(`${SESSION}/${session_id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        /*appInsightsException(error);*/
        console.log('Error getting a session: ', error);
        return null;
      });
  }

  async createSession(name?: string) {
    await ValidateSessionService.getInstance().validSessionCheck();
    return this.client
      .post<Session>(SESSION, { name })
      .then((response) => {
        const data = { ...defaultSession, ...response, wasLoaded: true };
        return data;
      })
      .catch((error) => {
        /*appInsightsException(error);*/
        console.log('Error creating a session: ', error.message);
        return null;
      });
  }

  async updateSession(session_id: string, name: string) {
    return this.client
      .put<Session>(`${SESSION}/${session_id}`, { name })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        /* appInsightsException(error); */
        console.log('Error updating a session: ', error.message);
        return null;
      });
  }

  async deleteSession(session_id: string) {
    return this.client
      .delete<boolean>(`${SESSION}/${session_id}`)
      .then(() => {
        return true;
      })
      .catch((error) => {
        /* appInsightsException(error);*/
        console.log('Error deleting a session: ', error.message);
        return false;
      });
  }
}
