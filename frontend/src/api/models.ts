export type AskResponse = {
    answer: string;
    citations: Citation[];
    error?: string;
};

export type Citation = {
    content: string;
    id: string;
    title: string | null;
    filepath: string | null;
    url: string | null;
    metadata: string | null;
    chunk_id: string | null;
    reindex_id: string | null;
}

export type ToolMessageContent = {
    citations: Citation[];
    intent: string;
}

export type ChatMessage = {
    role: string;
    content: string;
    end_turn?: boolean;
};

export enum ChatCompletionType {
    ChatCompletion = "chat.completion",
    ChatCompletionChunk = "chat.completion.chunk"
}

export type ChatResponseChoice = {
    messages: ChatMessage[];
}

export type ChatResponse = {
    id: string;
    model: string;
    created: number;
    object: ChatCompletionType;
    choices: ChatResponseChoice[];
    error: string;
}

export type ConversationRequest = {
    id?: string;
    messages: ChatMessage[];
    file?: File;
};

export type AdminConfigResponse = {
    user_intent_sys_prompt: string;
    text_processing_tool_sys_prompt: string;
    answering_user_prompt: string;
    answering_sys_prompt: string;
};

export type IngestDataResponse = {
    url: string;
    keywords: string;
}