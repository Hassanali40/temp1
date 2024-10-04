export type Session = {
  id: string;
  name: string;
  created: number;
  updated: number;
  qas: QA[];
  error?: string;
  isLoading: boolean; // true if we're loading session/qa data from the DB
  wasLoaded: boolean; // true if we already tried to load the QA's
  isWaiting: boolean; // true if we are waiting for response stream to start
  isStreaming: boolean; // true if we're streaming in response data
  taskId: string; // the task that is running (when polling)
  agentsStatus?: AgentStatus[]; // status of agents
  isQuerying: boolean; // true if we're waiting on the polling call

  inputPromptId: string;
  inputText: string;

  currentRecordingTimer: number;
};

export type QA = {
  id: string;
  created: number;
  updated: number;
  question: Question;
  answer: Answer;
  error?: string;
};

export type Question = {
  promptId: string;
  text: string;
  seed: number;
};

// basically the same as AskResponse
export type Answer = {
  answer: string; //TODO: rename to text
  thoughts?: string | null;
  edits?: string | null;
  data_points?: string[];
  procedures?: string[];
  notes?: string;
  error?: string;
  agentsStatus?: AgentStatus[];
  userRating?: string | null;
  feedbackText?: string | undefined;
};

export type AgentStatus = {
  id: number;
  state: number;
  include_output: boolean;
  identifier?: string;
  name: string;
  response: string;
  error: number;
  search_messages?: AgentMessage[];
  completion_messages?: AgentMessage[];
};

export type AgentMessage = {
  role: string;
  name?: string;
  content: string;
};

export type ChatHistoryTurn = {
  user: string;
  bot?: string;
  profile_id?: string;
  agentsStatus?: AgentStatus[];
};
