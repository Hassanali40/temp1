import {
  AgentChatPollingStartPayload,
  AgentChatPollingStartResponse,
  AgentChatWithPollingStatusResponse,
} from '../interfaces/qas';
import ApiClient from './api';
import ValidateSessionService from './validateSession';
import { API_URLS } from './routes';
import { QA } from '../interfaces/session';

const { SESSION, AGENT_CHAT } = API_URLS;

export default class QAsService {
  private static instance: QAsService | null = null;
  client: ApiClient;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  static getInstance(): QAsService {
    if (QAsService.instance === null) {
      QAsService.instance = new QAsService();
    }
    return QAsService.instance;
  }

  async getQAs(sessionId: string) {
    await ValidateSessionService.getInstance().validSessionCheck();
    try {
      const res = await this.client.get<QA[]>(`${SESSION}/${sessionId}/qas`);
      return res;
    } catch (_error) {
      console.log('Erro while getting history');
    }
  }

  async agentChatWithPollingStart(options: AgentChatPollingStartPayload, file: File | null) {
    await ValidateSessionService.getInstance().validSessionCheck();
    const profileId = 'px';

    if (file) {
      const formData = new FormData();

      formData.append('fileAttachment', file);
      formData.append('profile_id', profileId);
      formData.append('session_id', options.session_id);
      formData.append('generate_qa', new Boolean(options.generate_qa).toString());
      formData.append('keep_messages', new Boolean(options.keep_messages).toString());
      formData.append('history', JSON.stringify(options.history));
      formData.append('seed', String(options.seed));

      return this.client.post<AgentChatPollingStartResponse>(AGENT_CHAT, formData);
    }

    return this.client.post<AgentChatPollingStartResponse>(AGENT_CHAT, {
      ...options,
      profile_id: profileId,
    });
  }

  async agentChatWithPollingStatus(taskId: string) {
    return this.client.get<AgentChatWithPollingStatusResponse>(`${AGENT_CHAT}/${taskId}`);
  }

  async agentChatWithPollingCancel(taskId: string) {
    await ValidateSessionService.getInstance().validSessionCheck();
    return this.client.delete(`${AGENT_CHAT}/${taskId}`);
  }
}
