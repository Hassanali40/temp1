import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ApiClient from './api';

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = ApiClient.getInstance();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a singleton instance of ApiClient', () => {
    const newClient = ApiClient.getInstance();
    expect(client).toBe(newClient);
  });

  it('should make a successful GET request', async () => {
    const mockResponse = { data: 'test data' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve(mockResponse),
    });

    const response = await client.get('/test-endpoint');
    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/test-endpoint', expect.any(Object));
  });

  it('should handle 404 error correctly', async () => {
    const errorResponse = {
      status: 404,
      detail: 'Resource not found',
      title: 'Not Found',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve(errorResponse),
    });

    await expect(client.get('/not-found')).rejects.toEqual(errorResponse);
    expect(global.fetch).toHaveBeenCalledWith('/not-found', expect.any(Object));
  });

  it('should make a successful POST request', async () => {
    const mockRequest = { key: 'value' };
    const mockResponse = { id: 1 };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve(mockResponse),
    });

    const response = await client.post('/test-post', mockRequest);
    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/test-post', expect.any(Object));
  });

  it('should handle empty response for 204 status', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
      text: () => Promise.resolve(''),
    });

    const response = await client.get('/test-no-content');
    expect(response).toBeNull();
  });

  it('should set correct query parameters for GET request', async () => {
    const params = { key1: 'value1', key2: 'value2' };
    const expectedUrl = '/test-query?key1=value1&key2=value2';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });

    const response = await client.get('/test-query', params);
    expect(response).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
  });

  it('should handle unexpected JSON error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.reject(new SyntaxError('Unexpected token < in JSON at position 0')),
    });

    const response = await client.get('/invalid-json');
    expect(response).toEqual({});
  });

  it('should correctly handle Content-Type for blobs', async () => {
    const mockBlob = new Blob(['data'], { type: 'image/png' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'image/png' }),
      blob: () => Promise.resolve(mockBlob),
    });

    const response = await client.get('/image');
    expect(response).toBeInstanceOf(Blob);
  });
});
