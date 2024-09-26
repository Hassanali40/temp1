export type ConfigDataConversation = {
    conversation: string;
}

export type ConfigDataResponse = {
    instruction: string;
    rows: ConfigDataConversation[]
}