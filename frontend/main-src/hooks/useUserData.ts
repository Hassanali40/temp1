import { useCallback } from 'react';
import UserDataService, { defaultUserData } from '../services/user';
import { useGlobalStore } from '../store';

const userDataService = UserDataService.getInstance();

export default function useUserData() {
    const { updateUser, userData } = useGlobalStore()
    const getUserData = useCallback(async () => {
        try {
            const userData = await userDataService.getUser();
            if (userData) {
                updateUser(userData.id, userData);
            }
            return userData
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [updateUser])


    const updateUserData = async () => {
        try {
            const updatedUser = await userDataService.updateUser(defaultUserData)
            if (updatedUser) {
                updateUser(updatedUser.id, updatedUser)
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };
    return {
        getUserData,
        updateUserData,
        userData
    }
}
