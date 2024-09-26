import { describe, it, expect, afterEach, vi } from 'vitest';
import AdminConfigService from '../services/adminConfig';
import { API_URLS } from '../constants/api';

const { ADMIN_CONFIG } = API_URLS;

const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
};

vi.mock('../services/api', () => {
    return {
        default: {
            getInstance: () => mockApiClient,
        },
    };
});

type AdminConfigResponse = {
    user_intent_sys_prompt: string;
    text_processing_tool_sys_prompt: string;
    answering_user_prompt: string;
    answering_sys_prompt: string;
};

const defaultConfig: AdminConfigResponse = {
    user_intent_sys_prompt: '',
    text_processing_tool_sys_prompt: '',
    answering_user_prompt: '',
    answering_sys_prompt: ''
};

describe('AdminConfigService', () => {
    const adminConfigService = AdminConfigService.getInstance();

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getAdminConfigApi', () => {
        it('should send a GET request and return the admin config', async () => {
            const profileId = '12345';
            const mockResponse = { ...defaultConfig, success: true };
            mockApiClient.get.mockResolvedValueOnce(mockResponse);

            const response = await adminConfigService.getAdminConfigApi(profileId);

            expect(mockApiClient.get).toHaveBeenCalledWith(`${ADMIN_CONFIG}/${profileId}`);
            expect(response).toEqual(mockResponse);
        });

        it('should handle API errors gracefully', async () => {
            const profileId = '12345';
            mockApiClient.get.mockRejectedValueOnce(new Error('API Error'));

            const response = await adminConfigService.getAdminConfigApi(profileId);

            expect(response).toBeNull();
        });
    });

    describe('saveAdminConfigApi', () => {
        it('should send a POST request and return the response', async () => {
            const configData: AdminConfigResponse = {
                user_intent_sys_prompt: 'Prompt 1',
                text_processing_tool_sys_prompt: 'Prompt 2',
                answering_user_prompt: 'Prompt 3',
                answering_sys_prompt: 'Prompt 4',
            };
            const mockResponse = { success: true };
            mockApiClient.post.mockResolvedValueOnce(mockResponse);

            const response = await adminConfigService.saveAdminConfigApi(configData);

            expect(mockApiClient.post).toHaveBeenCalledWith(ADMIN_CONFIG, {
                body: JSON.stringify({ config: configData }),
            });
            expect(response).toEqual(mockResponse);
        });

        it('should handle API errors gracefully', async () => {
            const configData: AdminConfigResponse = {
                user_intent_sys_prompt: 'Prompt 1',
                text_processing_tool_sys_prompt: 'Prompt 2',
                answering_user_prompt: 'Prompt 3',
                answering_sys_prompt: 'Prompt 4',
            };
            mockApiClient.post.mockRejectedValueOnce(new Error('API Error'));

            const response = await adminConfigService.saveAdminConfigApi(configData);

            expect(response).toBeNull();
        });
    });
});
