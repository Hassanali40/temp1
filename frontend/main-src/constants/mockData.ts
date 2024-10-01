import { UserData } from "../interfaces/user";

export const defaultUserData = {
    id: "",
    bannerMessage: "Bellevue Medical Centre",
    isAdmin: true,
    isPowerUser: true,
    showDataPoints: false,
    user: "trustedUser@vituity.com",
    name: "Bob Mayers",
};

export const getMockUserData = async (): Promise<UserData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(defaultUserData);
        }, 500);
    });
};
