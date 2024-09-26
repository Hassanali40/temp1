import { describe, it, expect, afterEach, vi } from 'vitest';
import ConversationService from '../services/conversation';
import { API_URLS } from '../constants/api';

const { CONVERSATION, CUSTOM_CONVERSATION } = API_URLS;

const mockApiClient = {
    post: vi.fn(),
};

vi.mock('../services/api', () => {
    return {
        default: {
            getInstance: () => mockApiClient,
        },
    };
});

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
    id: '1',
    messages: [{ role: '1', content: 'abc', end_turn: false }],
    file: new File(['file content'], 'test.txt', { type: 'text/plain' }),
};

describe('ConversationService', () => {
    const conversationService = ConversationService.getInstance();

    afterEach(() => {
        vi.clearAllMocks(); // Reset all mocks after each test
    });

    describe('conversationApi', () => {
        it('should send a POST request and return the combined response', async () => {
            const mockResponse = {
                messages: [{ role: '1', content: 'abc', end_turn: false }],
                success: true
            };
            mockApiClient.post.mockResolvedValueOnce(mockResponse);

            const abortSignal = new AbortController().signal;

            const response = await conversationService.conversationApi(options, abortSignal);

            expect(mockApiClient.post).toHaveBeenCalledWith(CONVERSATION, {
                messages: options.messages,
                signal: abortSignal,
            });

            expect(response).toEqual({
                ...options,
                ...mockResponse,
                wasLoaded: true,
            });
        });

        it('should handle API errors gracefully', async () => {
            mockApiClient.post.mockRejectedValueOnce(new Error('API Error'));

            const abortSignal = new AbortController().signal;

            const response = await conversationService.conversationApi(options, abortSignal);

            expect(response).toBeNull();
        });
    });

    describe('customConversationApi', () => {
        it('should send a POST request with FormData and return the combined response', async () => {
            const mockResponse = {
                messages: [{ role: '1', content: 'abc', end_turn: false }],
                success: true
            };
            mockApiClient.post.mockResolvedValueOnce(mockResponse);

            const abortSignal = new AbortController().signal;

            const response = await conversationService.customConversationApi(options, abortSignal);

            expect(mockApiClient.post).toHaveBeenCalledWith(CUSTOM_CONVERSATION, {
                body: expect.any(FormData),
                signal: abortSignal,
            });

            const formData = (mockApiClient.post as jest.Mock).mock.calls[0][1].body as FormData;

            expect(formData.get('file_upload')).toEqual(options.file);
            expect(formData.get('data')).toEqual(JSON.stringify({
                messages: options.messages,
                conversation_id: options.id,
            }));

            expect(response).toEqual({
                ...options,
                ...mockResponse,
                wasLoaded: true,
            });
        });

        it('should handle API errors gracefully', async () => {
            mockApiClient.post.mockRejectedValueOnce(new Error('API Error'));

            const abortSignal = new AbortController().signal;

            const response = await conversationService.customConversationApi(options, abortSignal);

            expect(response).toBeNull();
        });
    });
});
