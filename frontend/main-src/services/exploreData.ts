import { ExploreFileDetailsResponse } from "../interfaces/exploreData";
import ApiClient from "./api";
import { API_URLS } from '../constants/api'
const { EXPLORE_DATA } = API_URLS

export const defaultExploreData: ExploreFileDetailsResponse = Object.freeze({
    chunkId: '',
    content: '',
    url: ''
})

export default class ExploreDataService {
    private static instance: ExploreDataService | null = null;
    client: ApiClient;

    constructor() {
        this.client = ApiClient.getInstance();
    }

    static getInstance(): ExploreDataService {
        if (ExploreDataService.instance === null) {
            ExploreDataService.instance = new ExploreDataService();
        }
        return ExploreDataService.instance;
    }

    async getIngestDataApi() {
        return this.client
            .get<Response>(EXPLORE_DATA)
            .then(response => {
                return response;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log("Error fetching ingest data: ", error.message);
                return null;
            });
    }

    async getExploreDataFileDetailsApi(fileId: string) {
        return this.client
            .get<ExploreFileDetailsResponse[]>(`${EXPLORE_DATA}/${fileId}`)
            .then(response => {
                let data = { ...defaultExploreData, ...response, wasLoaded: true };
                return data;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log(`Error fetching explore data file details for fileId: ${fileId}`, error.message);
                return null;
            });
    }

}