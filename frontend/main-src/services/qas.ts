import { AgentChatPollingStartPayload } from '../interfaces/qas';
import ApiClient from './api';
import ValidateSessionService from './validateSession';

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

  async agentChatWithPollingStart(_options: AgentChatPollingStartPayload) {
    await ValidateSessionService.getInstance().validSessionCheck();
    return {
      task_id: '123',
    };
    // return this.client.post<AgentChatPollingStartResponse>(`/agent_chat_detached`, options);
  }

  async agentChatWithPollingStatus(_taskId: string) {
    // return this.client.get<AgentChatWithPollingStatusResponse>(`/agent_chat_detached/${taskId}`);
    return {
      state: 1,
      agents_status: [],
    };
  }

  async agentChatWithPollingCancel(taskId: string) {
    await ValidateSessionService.getInstance().validSessionCheck();
    return this.client.delete(`/agent_chat_detached/${taskId}`);
  }
}
