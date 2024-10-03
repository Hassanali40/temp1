import { describe, it, expect, afterEach, vi } from 'vitest';
import UserDataService from '../services/user';
import { API_URLS } from '../services/routes';

const { USER } = API_URLS;

const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
};

vi.mock('../services/api', () => ({
  default: {
    getInstance: () => mockApiClient,
  },
}));

const mockUserData = {
  id: '123',
  bannerMessage: 'Welcome User',
  isAdmin: true,
  user: 'test@vituity.com',
  name: 'Test User',
};

describe('UserDataService', () => {
  const userDataService = UserDataService.getInstance();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should send a GET request and return user data', async () => {
      const mockResponse = mockUserData;
      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      const response = await userDataService.getUser();

      expect(mockApiClient.get).toHaveBeenCalledWith(USER);
      expect(response).toEqual(mockResponse);
    });

    it('should handle errors gracefully', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('API Error'));

      const response = await userDataService.getUser();

      expect(response).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should send a POST request and return updated user data', async () => {
      const mockResponse = { ...mockUserData, wasLoaded: true };
      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const response = await userDataService.updateUser(mockUserData);

      expect(mockApiClient.post).toHaveBeenCalledWith(USER, {
        params: mockUserData,
      });
      expect(response).toEqual(mockResponse);
    });

    it('should handle errors gracefully on update', async () => {
      mockApiClient.post.mockRejectedValueOnce(new Error('Update Error'));

      const response = await userDataService.updateUser(mockUserData);

      expect(response).toBeNull();
    });
  });
});
