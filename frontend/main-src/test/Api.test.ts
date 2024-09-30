import { describe, it, expect, afterEach, vi } from 'vitest';
import { conversationApi, customConversationApi } from '../api';
import { API_URLS } from '../constants/api';

const { CONVERSATION, CUSTOM_CONVERSATION } = API_URLS;

global.fetch = vi.fn();

type ConversationRequest = {
    id?: string;
    messages: ChatMessage[];
    file?: File;
};

type ChatMessage = {
    role: string;
    content: string;
    end_turn?: boolean;
};

const options: ConversationRequest = {
    id: '', messages: [{ role: '1', content: 'abc', end_turn: false }], file: new File(['file content'], 'test.txt', { type: 'text/plain' })
};

describe('API Functions', () => {

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('conversationApi', () => {
        it('should send a POST request for conversationApi', async () => {
            const abortSignal = new AbortController().signal;

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            const response = await conversationApi(options, abortSignal);

            expect(fetch).toHaveBeenCalledWith(CONVERSATION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: options.messages }),
                signal: abortSignal,
            });

            expect(await response.json()).toEqual({ success: true });
        });

        it('should handle fetch failure', async () => {
            const options: ConversationRequest = { id: '', messages: [] };
            const abortSignal = new AbortController().signal;

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: 'Bad Request',
            });

            await expect(conversationApi(options, abortSignal)).rejects.toThrow('Bad Request');
        });
    });

    describe('customConversationApi', () => {
        it('should send a POST request with FormData', async () => {
            const abortSignal = new AbortController().signal;

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            const response = await customConversationApi(options, abortSignal);

            expect(fetch).toHaveBeenCalledWith(CUSTOM_CONVERSATION, {
                method: 'POST',
                body: expect.any(FormData),
                signal: abortSignal,
            });

            const receivedFormData = (fetch as jest.Mock).mock.calls[0][1].body;
            expect(receivedFormData.get('file_upload')).toEqual(options.file);
            expect(receivedFormData.get('data')).toEqual(JSON.stringify({ messages: options.messages, conversation_id: options.id }));

            expect(await response.json()).toEqual({ success: true });
        });

        it('should handle fetch failure', async () => {
            const abortSignal = new AbortController().signal;

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: 'Bad Request',
            });

            await expect(customConversationApi(options, abortSignal)).rejects.toThrow('Bad Request');
        });
    });
});
