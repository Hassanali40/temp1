import { Session } from '../interfaces/session';
import { QAsService, SessionService } from '../services';
import { useGlobalStore } from '../store';
import { defaultSession } from '../store/session';

const sessionService = SessionService.getInstance();
const qasService = QAsService.getInstance();

export default function useSession() {
  const {
    addSession,
    sessions,
    activeSession,
    setActiveSession: _setActiveSession,
    deleteSession: _deleteSession,
    updateSession: _updateSession,
  } = useGlobalStore();

  const getQAs = async (sessionId: string) => {
    try {
      updateSession(sessionId, { qas: [], isLoading: true });
      const qas = await qasService.getQAs(sessionId);
      _updateSession(sessionId, { qas, isLoading: false, wasLoaded: true });
      return qas;
    } catch (_error) {
      console.log('error setting new session');
    }
  };

  const createNewSession = async () => {
    addSession({ ...defaultSession, isLoading: true });
    try {
      const newSession = await sessionService.createSession('New Session');
      if (!newSession) return;
      _updateSession(defaultSession?.id, {
        ...newSession,
        isLoading: false,
      });
    } catch (_error) {
      _deleteSession(defaultSession?.id);
    }
  };

  const setActiveSession = (sessionId: string) => {
    _setActiveSession(sessionId);
  };

  const deleteSession = async (sessionId: string) => {
    try {
      _deleteSession(sessionId);
      await sessionService.deleteSession(sessionId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<Pick<Session, keyof Session>>) => {
    _updateSession(sessionId, { ...updates });

    if (!updates.name) return;
    try {
      await sessionService.updateSession(sessionId, updates.name);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createNewSession,
    sessions,
    activeSession,
    setActiveSession,
    deleteSession,
    updateSession,
    getQAs,
  };
}
