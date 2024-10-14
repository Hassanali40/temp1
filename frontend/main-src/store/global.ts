import { create } from 'zustand';
import { createSessionStore, defaultSession, ISessionStore } from './session';
import { createUserStore, IUserStore } from './user';
import UserDataService from '../services/user';
import { UserData } from '../interfaces/user';

const userDataService = UserDataService.getInstance();

interface IGlobalStore {
  getUser: () => Promise<UserData | undefined>;
}

export const useGlobalStore = create<ISessionStore & IUserStore & IGlobalStore>((set, ...a) => ({
  ...createSessionStore(set, ...a),
  ...createUserStore(set, ...a),

  getUser: async () => {
    const userData = await userDataService.getUser();
    if (!userData) return;
    set((state) => ({
      ...state,
      userData,
      sessions: userData.chatSessions.map((ele) => ({
        ...defaultSession,
        ...ele,
        wasLoaded: false,
      })),
      activeSession: userData.activeSession,
    }));
    return userData;
  },
}));
