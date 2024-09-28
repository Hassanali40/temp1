import { UserData } from "../interfaces/user";
import ApiClient from "./api";
import { API_URLS } from '../constants/api'
const { USER } = API_URLS;
import { jsonUrlFile } from '../constants/mockData'

export const defaultUserData: UserData = Object.freeze({
    id: "",
    bannerMessage: "",
    isAdmin: true,
    isPowerUser: true,
    showDataPoints: false,
    user: "trustedUser@vituity.com",
    name: "Bob Mayers",
})

export default class UserDataService {
    private static instance: UserDataService | null = null;
    client: ApiClient;

    constructor() {
        this.client = ApiClient.getInstance();
    }

    static getInstance(): UserDataService {
        if (UserDataService.instance === null) {
            UserDataService.instance = new UserDataService();
        }
        return UserDataService.instance;
    }

    async getUser() {
        try {
            const response = await fetch(jsonUrlFile);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.log("Error fetching user information: ", error.message);
            return null;
        }

    // Use this placeholder when call the api endpoints

        // return this.client
        //     .get<UserData>(USER)
        //     .then(response => {
        //         console.log('responseeee', response)
        //         return response;
        //     })
        //     .catch(error => {
        //         console.log("Error fetching user information: ", error.message);
        //         return null;
        //     });   
}

    async UpdateUser(params ?: UserData) {
    return this.client
        .post<UserData>(USER, { params })
        .then(response => {
            let data = { ...defaultUserData, ...response, wasLoaded: true };
            return data;
        })
        .catch(error => {
            /*appInsightsException(error);*/
            console.log("Error creating a session: ", error.message);
            return null;
        });
};
    
}
