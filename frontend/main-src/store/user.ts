import { StateCreator } from 'zustand';
import { UserData } from '../interfaces/user';

type userPaylodStoreType = Omit<UserData, 'chatSessions' | 'activeSession'>;

export const defaultUserData: userPaylodStoreType = {
  id: '',
  bannerMessage: '',
  isAdmin: false,
  user: '',
  name: '',
};

export interface IUserStore {
  userData: userPaylodStoreType;
  updateUser: (updates: Partial<Pick<UserData, keyof UserData>>) => void;
}

export const createUserStore: StateCreator<IUserStore> = (set) => ({
  userData: defaultUserData,
  updateUser: (updates: Partial<Pick<UserData, keyof UserData>>) => {
    set((state) => ({
      ...state,
      userData: { ...state.userData, ...updates },
    }));
  },
});
