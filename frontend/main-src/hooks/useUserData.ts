import { UserData } from '../interfaces/user';
import UserDataService, { defaultUserData } from '../services/user';
import { useGlobalStore } from '../store';

const userDataService = UserDataService.getInstance();

export default function useUserData(){
    const { updateUser  } = useGlobalStore()
    const getUserData = async () => {
        try {
            const userData: UserData | null = await userDataService.getUser();
            if (userData) {
                updateUser(userData.id, userData);
            }
            return userData
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    const updateUserData = async () => {
        try {
            const updatedUser = await userDataService.UpdateUser(defaultUserData)
            if (updatedUser) {
                updateUser(updatedUser.id, updatedUser)
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };
    return {
        getUserData,
        updateUserData
    }
}
