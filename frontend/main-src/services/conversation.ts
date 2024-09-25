import { ConversationRequest } from "../interfaces/conversation";
import ApiClient from "./api";
import { API_URLS } from '../constants/api'
const { CONVERSATION, CUSTOM_CONVERSATION } = API_URLS

export const defaultConversation: ConversationRequest = Object.freeze({
    id: '1',
    messages: [],
    file: new File(['file content'], 'test.txt', { type: 'text/plain' })
})

export default class ConversationService {
    private static instance: ConversationService | null = null;
    client: ApiClient;

    constructor() {
        this.client = ApiClient.getInstance();
    }

    static getInstance(): ConversationService {
        if (ConversationService.instance === null) {
            ConversationService.instance = new ConversationService();
        }
        return ConversationService.instance;
    }

    async conversationApi(options: ConversationRequest, abortSignal: AbortSignal) {
        return this.client
            .post<ConversationRequest>(CONVERSATION, { messages: options.messages, signal: abortSignal })
            .then(response => {
                let data = { ...defaultConversation, ...response, wasLoaded: true };
                return data;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log("Error in conversation API: ", error.message);
                return null;
            });
    }

    async customConversationApi(options: ConversationRequest, abortSignal: AbortSignal) {
        const formData = new FormData();
        if (options.file) {
            formData.append('file_upload', options.file);
        }
        formData.append('data', JSON.stringify({
            messages: options.messages,
            conversation_id: options.id
        }));

        return this.client
            .post<Response>(CUSTOM_CONVERSATION, { body: formData, signal: abortSignal })
            .then(response => {
                return response;
            })
            .catch(error => {
                /* appInsightsException(error); */
                console.log("Error in custom conversation API: ", error.message);
                return null;
            });
    }
}