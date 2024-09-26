import { ConfigDataResponse } from "../interfaces/configuration";
import ApiClient from "./api";
import { API_URLS } from '../constants/api'
const { CONFIGURATION } = API_URLS

export const defaultConfigurationData: ConfigDataResponse = Object.freeze({
    instruction: '',
    rows: [],
})

export default class ConfigurationService {
    private static instance: ConfigurationService | null = null;
    client: ApiClient;

    constructor() {
        this.client = ApiClient.getInstance();
    }

    static getInstance(): ConfigurationService {
        if (ConfigurationService.instance === null) {
            ConfigurationService.instance = new ConfigurationService();
        }
        return ConfigurationService.instance;
    }

    async getConfigurationApi() {
        return this.client
            .get<Response>(CONFIGURATION)
            .then(response => {
                return response;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log("Error fetching ingest data: ", error.message);
                return null;
            });
    }

    async saveConfigurationDataApi(data: ConfigDataResponse) {
        return this.client
            .post<Response>(CONFIGURATION, {
                body: JSON.stringify({
                    ConfigData: data
                })
            })
            .then(response => {
                let data = { ...defaultConfigurationData, ...response, wasLoaded: true };
                return data;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log("Error saving configuration data: ", error.message);
                return null;
            });
    }
    

}