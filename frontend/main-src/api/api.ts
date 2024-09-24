import { ConversationRequest, AdminConfigResponse, IngestDataResponse, ExploreFileDetailsResponse, ConfigDataResponse } from "./models";
import { API_URLS } from '../constants/api'
const { ADMIN_CONFIG, CONFIGURATION, INGEST_DATA, EXPLORE_DATA, CONVERSATION, CUSTOM_CONVERSATION } = API_URLS

export async function conversationApi(options: ConversationRequest, abortSignal: AbortSignal): Promise<Response> {
    const response = await fetch(CONVERSATION, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: options.messages
        }),
        signal: abortSignal
    });

    if (!response.ok) {
        throw new Error(JSON.stringify({
            message: response.statusText,
        }));
    }

    return response;
}


export async function customConversationApi(options: ConversationRequest, abortSignal: AbortSignal): Promise<Response> {
    const formData = new FormData();
    if (options.file){
        formData.append('file_upload', options.file);
    }
    formData.append('data', JSON.stringify({
        messages: options.messages,
        conversation_id: options.id
    }));
    const response = await fetch(CUSTOM_CONVERSATION, {
        method: "POST",
        body: formData,
        signal: abortSignal
    });

    if (!response.ok) {
        throw new Error(JSON.stringify({
            message: response.statusText,
        }));
    }

    return response;
}

export async function getAdminConfigApi(profileId: string): Promise<AdminConfigResponse> {
    const response = await fetch(`${ADMIN_CONFIG}/${profileId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
  
    return response.json();
  }
  
  export async function saveAdminConfigApi(data: AdminConfigResponse): Promise<Response> {
    const response = await fetch(ADMIN_CONFIG, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            config: data
        }),
    });
    return response;
  }


export async function getIngestDataApi(): Promise<IngestDataResponse[]> {
    try {
        const response = await fetch(INGEST_DATA, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(JSON.stringify({
                message: response.statusText,
            }));
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function saveIngestDataApi(data: IngestDataResponse[]): Promise<Response> {
    try {
        const response = await fetch(INGEST_DATA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ingestData: data
            }),
        });
        if (!response.ok) {
            throw new Error(JSON.stringify({
                message: response.statusText,
            }));
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getExploreDataFileApi(): Promise<[]> {
    const response = await fetch(EXPLORE_DATA, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.json();
}

export async function getExploreDataFileDetailsApi(fileId: string): Promise<ExploreFileDetailsResponse[]> {
    const response = await fetch(`${EXPLORE_DATA}/${fileId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.json();
}

export async function getConfigurationApi(): Promise<[]> {
    try {
        const response = await fetch(CONFIGURATION, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(JSON.stringify({
                message: response.statusText,
            }));
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function saveConfigurationDataApi(data: ConfigDataResponse): Promise<Response> {
    try {
        const response = await fetch(CONFIGURATION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ConfigData: data
            }),
        });
        if (!response.ok) {
            throw new Error(JSON.stringify({
                message: response.statusText,
            }));
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}