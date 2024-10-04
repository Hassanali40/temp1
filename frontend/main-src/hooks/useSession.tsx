import { Session } from '../interfaces/session';
import { SessionService } from '../services';
import { useGlobalStore } from '../store';

const sessionService = SessionService.getInstance();

export default function useSession() {
  const {
    addSession,
    sessions,
    activeSession,
    setActiveSession: _setActiveSession,
    deleteSession: _deleteSession,
    updateSession: _updateSession,
  } = useGlobalStore();

  const createNewSession = async () => {
    const newSession = await sessionService.createSession('New Session');
    if (!newSession) return;
    addSession(newSession);
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
    if (!updates.name) return;
    try {
      _updateSession(sessionId, { ...updates });
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
  };
}
