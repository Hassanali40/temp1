import {StateCreator} from 'zustand';
import {Session} from '../interfaces/session';

export interface ISessionStore {
    sessions: Session[],
    activeSession: Session | null,
    setActiveSession: (sessionId: string) => void;
    updateSessionsList: (sessions: Session[]) => void;
    addSession: (session: Partial<Pick<Session, keyof Session>>) => void;
}

export const defaultSession: Session = {
    id: "-1",
    name: "New Patient",
    created: 0,
    updated: 0,
    qas: undefined,
    error: "",
    isLoading: false,
    wasLoaded: false,
    isWaiting: false,
    isStreaming: false,
    taskId: "",
    agentsStatus: [],
    isQuerying: false,
    inputText: "",
    inputPromptId: "",
    currentRecordingTimer: 0,
};

const getActiveSession = (sessionId: string, get: () => ISessionStore): Session | null => {
    const sessionsList = get().sessions
    const indexOfSession = sessionsList.findIndex((ele) => ele.id === sessionId);

    if(indexOfSession < 0){
        return null
    }

    return sessionsList[indexOfSession];
}

const updatedSession = (sessions: Session[], sessionId: string, updates: Partial<Pick<Session, keyof Session>>): Session[] => {
    const newSessions = sessions.map(ele => (ele.id === sessionId ? {...ele, ...updates}: {...ele}))
    return newSessions;
}

export const createSessionStore: StateCreator<ISessionStore> = (set, get) => ({
    sessions: [],
    activeSession: null,
    setActiveSession: (sessionId: string) => set((state) => ({...state, activeSession: getActiveSession(sessionId, get)})),
    updateSessionsList: (sessions: Session[]) => set((state) => ({...state, sessions: sessions.map((ele) => ({...defaultSession, ...ele })) })),
    updateSession: (sessionId: string, updates: Partial<Pick<Session, keyof Session>>) => set(state => ({ ...state, sessions: updatedSession(state.sessions, sessionId, updates) })),
    addSession: (session: Partial<Pick<Session, keyof Session>>) => set(state => ({...state, sessions: [...state.sessions, {...defaultSession, ...session}]}))
  })
