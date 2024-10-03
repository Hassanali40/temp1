import { StateCreator } from 'zustand';
import { UserData } from '../interfaces/user';
import UserDataService from '../services/user';

const userDataService = UserDataService.getInstance();

export const defaultUserData: UserData = {
  id: '',
  bannerMessage: '',
  isAdmin: false,
  user: '',
  name: '',
};

export interface IUserStore {
  userData: UserData;
  updateUser: (updates: Partial<Pick<UserData, keyof UserData>>) => void;
  getUser: () => Promise<UserData | undefined>;
}

export const createUserStore: StateCreator<IUserStore> = (set) => ({
  userData: defaultUserData,
  getUser: async () => {
    const userData = await userDataService.getUser();
    if (!userData) return;
    set((state) => ({
      ...state,
      userData,
    }));
    return userData;
  },
  updateUser: (updates: Partial<Pick<UserData, keyof UserData>>) => {
    set((state) => ({
      ...state,
      userData: { ...state.userData, ...updates },
    }));
  },
});
