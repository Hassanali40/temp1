import { IngestDataResponse } from "../interfaces/ingestData";
import ApiClient from "./api";
import { API_URLS } from '../constants/api'
const { INGEST_DATA } = API_URLS

export const defaultIngestData: IngestDataResponse = Object.freeze({
    url: '',
    keywords: ''
})

export default class IngestDataService {
    private static instance: IngestDataService | null = null;
    client: ApiClient;

    constructor() {
        this.client = ApiClient.getInstance();
    }

    static getInstance(): IngestDataService {
        if (IngestDataService.instance === null) {
            IngestDataService.instance = new IngestDataService();
        }
        return IngestDataService.instance;
    }

    async getIngestDataApi() {
        return this.client
            .get<IngestDataResponse[]>(INGEST_DATA)
            .then(response => {
                return response;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log("Error fetching ingest data: ", error.message);
                return null;
            });
    }


    async saveIngestDataApi(data: IngestDataResponse[]) {
        return this.client
            .post<IngestDataResponse[]>(INGEST_DATA, {
                body: JSON.stringify({
                    ingestData: data
                })
            })
            .then(response => {
                let data = { ...defaultIngestData, ...response, wasLoaded: true };
                return data;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log("Error saving ingest data: ", error.message);
                return null;
            });
    }
}