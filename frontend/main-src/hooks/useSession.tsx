import { SessionService } from '../services';
import { useGlobalStore } from '../store';

const sessionService = SessionService.getInstance();

export default function useSession() {
  const { addSession, sessions, activeSession, setActiveSession: _setActiveSession } = useGlobalStore();

  const createNewSession = async () => {
    const _res = await sessionService.createSession('new patient');

    addSession({
      created: 1727236429.189552,
      id: `${Math.random()}`,
      name: 'This is mocked data',
      updated: 1727236429.189552,
    });
  };

  const setActiveSession = (sessionId: string) => {
    _setActiveSession(sessionId);
  };

  return {
    createNewSession,
    sessions,
    activeSession,
    setActiveSession,
  };
}
