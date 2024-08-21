import { ConversationRequest, AdminConfigResponse, IngestDataResponse } from "./models";

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
    if (options.file) {
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
    const response = await fetch("/api/admin_config", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.json();
}

export async function saveAdminConfigApi(data: AdminConfigResponse): Promise<Response> {
    const response = await fetch("/api/admin_config", {
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
    const response = await fetch("/api/ingest_data", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.json();
}

export async function saveIngestDataApi(data: IngestDataResponse[]): Promise<Response> {
    const response = await fetch("/api/ingest_data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ingestData: data
        }),
    });
    return response;
}
