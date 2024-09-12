import { ConversationRequest, AdminConfigResponse, IngestDataResponse, ExploreFileDetailsResponse, ConfigDataResponse } from "./models";

export async function conversationApi(options: ConversationRequest, abortSignal: AbortSignal): Promise<Response> {
    const response = await fetch("/api/conversation/azure_byod", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: options.messages
        }),
        signal: abortSignal
    });

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
    const response = await fetch("/api/conversation/custom", {
        method: "POST",
        body: formData,
        signal: abortSignal
    });

    return response;
}

export async function getAdminConfigApi(): Promise<AdminConfigResponse> {
    const profileId = 'PX'
    const response = await fetch(`/admin/api/profile/${profileId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
  
    return response.json();
  }
  
  export async function saveAdminConfigApi(data: AdminConfigResponse): Promise<Response> {
    const profileId = 'PX'
  
    const response = await fetch(`/admin/api/profile/${profileId}`, {
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
        const response = await fetch("/api/ingest_data", {
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
        const response = await fetch("/api/ingest_data", {
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
    const response = await fetch("/api/expore_data_file", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.json();
}

export async function getExploreDataFileDetailsApi(): Promise<ExploreFileDetailsResponse[]> {
    const response = await fetch("/api/expore_data_file_detail", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.json();
}

export async function getConfigurationApi(): Promise<[]> {
    try {
        const response = await fetch("/api/get_config", {
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
        const response = await fetch("/api/conig_data", {
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