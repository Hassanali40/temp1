import { StateCreator } from 'zustand';
import { Session } from '../interfaces/session';

export interface ISessionStore {
  sessions: Session[] | [];
  activeSession: Session | null;
  setActiveSession: (sessionId: string) => void;
  updateSessionsList: (sessions: Session[]) => void;
  addSession: (session: Partial<Pick<Session, keyof Session>>) => void;
  updateSession: (sessionId: string, updates: Partial<Pick<Session, keyof Session>>) => void;
  deleteSession: (sessionId: string) => void;
}

export const defaultSession: Session = {
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
};

const getActiveSession = (sessionId: string, get: () => ISessionStore): Session | null => {
  const sessionsList = get().sessions;
  const indexOfSession = sessionsList.findIndex((ele) => ele.id === sessionId);

  if (indexOfSession < 0) {
    return null;
  }

  return sessionsList[indexOfSession];
};

const updatedSession = (
  sessions: Session[],
  sessionId: string,
  updates: Partial<Pick<Session, keyof Session>>,
): Session[] => {
  const newSessions = sessions.map((ele) => (ele.id === sessionId ? { ...ele, ...updates } : { ...ele }));
  return newSessions;
};

export const createSessionStore: StateCreator<ISessionStore> = (set, get) => ({
  sessions: [],
  activeSession: null,
  setActiveSession: (sessionId: string) =>
    set((state) => ({ ...state, activeSession: getActiveSession(sessionId, get) })),
  updateSessionsList: (sessions: Session[]) =>
    set((state) => {
      const newSessions = sessions.map((ele) => ({ ...defaultSession, ...ele }));
      const activeSessionId = state.activeSession?.id;
      const newActiveSession = newSessions.find((session) => session.id === activeSessionId) || null;
      return { ...state, sessions: newSessions, activeSession: newActiveSession };
    }),
  updateSession: (sessionId: string, updates: Partial<Pick<Session, keyof Session>>) =>
    set((state) => {
      const newSessions = updatedSession(state.sessions, sessionId, updates);
      const isActiveSession = state.activeSession?.id === sessionId;
      const newActiveSession =
        isActiveSession && state.activeSession ? { ...state.activeSession, ...updates } : state.activeSession;
      return { ...state, sessions: newSessions, activeSession: newActiveSession };
    }),
  addSession: (session: Partial<Pick<Session, keyof Session>>) =>
    set((state) => {
      const newSession = { ...defaultSession, ...session };
      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        activeSession: newSession,
      };
    }),
  deleteSession: (sessionId: string) =>
    set((state) => {
      const newSessions = state.sessions.filter(({ id }) => id !== sessionId);
      const activeIndex = state.sessions.findIndex((s) => s.id == sessionId);
      const isActiveSession = state.activeSession?.id === sessionId;
      const newActiveSession = isActiveSession
        ? activeIndex < newSessions.length
          ? newSessions[activeIndex]
          : newSessions.length
            ? newSessions[activeIndex - 1]
            : null
        : state.activeSession;

      return { ...state, sessions: newSessions, activeSession: newActiveSession };
    }),
});
