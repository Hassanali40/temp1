// sessionStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { StateCreator, create } from 'zustand';
import { createSessionStore, ISessionStore, defaultSession } from './session';
import { Session } from '../interfaces/session';

describe('Session Store', () => {
  let useStore: ReturnType<typeof create<ISessionStore>>;

  beforeEach(() => {
    // Create a new store instance before each test to ensure isolation
    useStore = create<ISessionStore>(createSessionStore as StateCreator<ISessionStore>);
  });

  it('should have initial state', () => {
    const { sessions, activeSession } = useStore.getState();
    expect(sessions).toEqual([]);
    expect(activeSession).toBeNull();
  });

  it('should add a new session and set it as activeSession', () => {
    const sessionData: Partial<Session> = {
      id: '1',
      name: 'Test Session',
      created: Date.now(),
      updated: Date.now(),
    };

    useStore.getState().addSession(sessionData);

    const { sessions, activeSession } = useStore.getState();

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({ ...defaultSession, ...sessionData });
    expect(activeSession).toMatchObject({ ...defaultSession, ...sessionData });
  });

  it('should merge defaultSession properties when adding a new session', () => {
    const sessionData: Partial<Session> = {
      id: '1',
      name: 'Test Session',
    };

    useStore.getState().addSession(sessionData);

    const addedSession = useStore.getState().sessions[0];

    expect(addedSession.qas).toEqual([]);
    expect(addedSession.error).toBe('');
    expect(addedSession.isLoading).toBe(false);
    // Add other default properties as needed
  });

  it('should set active session correctly', () => {
    const sessionData1: Partial<Session> = {
      id: '1',
      name: 'Session 1',
    };
    const sessionData2: Partial<Session> = {
      id: '2',
      name: 'Session 2',
    };

    useStore.getState().addSession(sessionData1);
    useStore.getState().addSession(sessionData2);

    // The last added session should be active
    let { activeSession } = useStore.getState();
    expect(activeSession?.id).toBe('2');

    // Now set active session to '1'
    useStore.getState().setActiveSession('1');
    activeSession = useStore.getState().activeSession;
    expect(activeSession?.id).toBe('1');
  });

  it('should set activeSession to null if sessionId does not exist', () => {
    useStore.getState().setActiveSession('non-existent-id');
    const { activeSession } = useStore.getState();
    expect(activeSession).toBeNull();
  });

  it('should update sessions list and activeSession accordingly', () => {
    const sessionData1: Session = {
      ...defaultSession,
      id: '1',
      name: 'Session 1',
    };
    const sessionData2: Session = {
      ...defaultSession,
      id: '2',
      name: 'Session 2',
    };

    useStore.getState().updateSessionsList([sessionData1, sessionData2]);

    let { sessions, activeSession } = useStore.getState();
    expect(sessions).toHaveLength(2);
    expect(activeSession).toBeNull();

    // Set active session to '1'
    useStore.getState().setActiveSession('1');

    // Update sessions list, removing session '1'
    const sessionData3: Session = {
      ...defaultSession,
      id: '3',
      name: 'Session 3',
    };
    useStore.getState().updateSessionsList([sessionData2, sessionData3]);

    ({ sessions, activeSession } = useStore.getState());
    expect(sessions).toHaveLength(2);
    expect(activeSession).toBeNull();
  });

  it('should merge defaultSession properties when updating sessions list', () => {
    const sessionData: Partial<Session> = {
      id: '1',
      name: 'Session 1',
    };

    useStore.getState().updateSessionsList([sessionData as Session]);

    const addedSession = useStore.getState().sessions[0];

    expect(addedSession.qas).toEqual([]);
    expect(addedSession.error).toBe('');
    expect(addedSession.isLoading).toBe(false);
    // Add other default properties as needed
  });

  it('should update a session and activeSession if it is the session being updated', () => {
    const sessionData1: Session = {
      ...defaultSession,
      id: '1',
      name: 'Session 1',
    };
    const sessionData2: Session = {
      ...defaultSession,
      id: '2',
      name: 'Session 2',
    };

    useStore.getState().updateSessionsList([sessionData1, sessionData2]);
    useStore.getState().setActiveSession('1');

    useStore.getState().updateSession('1', { name: 'Updated Session 1' });

    const { sessions, activeSession } = useStore.getState();
    const updatedSession = sessions.find((s) => s.id === '1');

    expect(updatedSession?.name).toBe('Updated Session 1');
    expect(activeSession?.name).toBe('Updated Session 1');
  });

  it('should update a session but not activeSession if it is not the session being updated', () => {
    const sessionData1: Session = {
      ...defaultSession,
      id: '1',
      name: 'Session 1',
    };
    const sessionData2: Session = {
      ...defaultSession,
      id: '2',
      name: 'Session 2',
    };

    useStore.getState().updateSessionsList([sessionData1, sessionData2]);
    useStore.getState().setActiveSession('1');

    useStore.getState().updateSession('2', { name: 'Updated Session 2' });

    const { sessions, activeSession } = useStore.getState();
    const updatedSession = sessions.find((s) => s.id === '2');

    expect(updatedSession?.name).toBe('Updated Session 2');
    expect(activeSession?.name).toBe('Session 1');
  });

  it('should not update any session if the sessionId does not exist', () => {
    const sessionData1: Session = {
      ...defaultSession,
      id: '1',
      name: 'Session 1',
    };

    useStore.getState().updateSessionsList([sessionData1]);

    useStore.getState().updateSession('non-existent-id', { name: 'Updated Session' });

    const { sessions } = useStore.getState();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].name).toBe('Session 1');
  });

  it('should set sessions to empty array and activeSession to null when updating sessions list with empty array', () => {
    const sessionData1: Session = {
      ...defaultSession,
      id: '1',
      name: 'Session 1',
    };

    useStore.getState().updateSessionsList([sessionData1]);
    useStore.getState().setActiveSession('1');

    useStore.getState().updateSessionsList([]);

    const { sessions, activeSession } = useStore.getState();

    expect(sessions).toEqual([]);
    expect(activeSession).toBeNull();
  });
});
