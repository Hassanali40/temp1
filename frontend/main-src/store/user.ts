import { StateCreator } from 'zustand';
import { UserData } from '../interfaces/user';

export const defaultUserData: UserData = {
    id: "",
    bannerMessage: "Bellevue Medical Centre",
    isAdmin: true,
    isPowerUser: true,
    showDataPoints: false,
    user: "trustedUser@vituity.com",
    name: "Bob Mayers",
};

export interface IUserStore {
    userData: UserData;
    setUserData: (userId: string) => void;
    updateUser: (userId: string, updates: Partial<Pick<UserData, keyof UserData>>) => void;
}

const getUserData = (userId: string, get: () => IUserStore): UserData | null => {
    const { userData } = get();
    return userData.id === userId ? userData : null;
}

const updateUserData = (userData: UserData, userId: string, updates: Partial<Pick<UserData, keyof UserData>>): UserData => {
    return userData.id === userId ? { ...userData, ...updates } : userData;
}

export const createUserStore: StateCreator<IUserStore> = (set, get) => ({
    userData: defaultUserData,

    setUserData: (userId: string) => {
        const user = getUserData(userId, get);
        if (user) {
            set((state) => ({ ...state, userData: user }));
        }
    },

    updateUser: (userId: string, updates: Partial<Pick<UserData, keyof UserData>>) => {
        set((state) => ({
            ...state,
            userData: updateUserData(state.userData, userId, updates),
        }));
    },
});
