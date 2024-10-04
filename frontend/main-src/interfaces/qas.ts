import { AgentStatus, ChatHistoryTurn, QA } from './session';

export type AgentChatPollingStartPayload = {
  generate_qa: boolean;
  session_id: string;
  profile_id: string;
  keep_messages: boolean;
  history: ChatHistoryTurn[];
  seed: number;
};

export type AgentChatPollingStartResponse = {
  task_id: string;
};

export type AgentChatWithPollingStatusResponse = {
  agents_status: AgentStatus[] | null;
  qa: QA | null;
  state: 0 | 1 | 2 | 3 | 4;
};
