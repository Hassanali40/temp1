import { describe, expect, it, vi } from 'vitest';
// import { render, screen, fireEvent } from '@testing-library/react';
import { saveConfigurationDataApi } from '../src/api/api.ts'
const url = 'localhost:5173';

// Mock fetch globally
global.fetch = vi.fn();

const createFetchResponse = (ok, status, data) => ({
  ok: ok,
  status: status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: () => Promise.resolve(data),
});
const mockData = { instruction: 'Test instruction', rows: [{ converstation: 'Test conversation' }] };

describe('Config API Handling', () => {

  it('successfully handles a config response when ok', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve(createFetchResponse(true, 200, mockData)));
    
    const response = await fetch(`${url}/api/get_config`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    // Check if the data matches the mock data
    expect(data).toEqual(mockData);
  });

  it('successfully posts config data and returns response', async () => {
    const mockData = { success: true };
    fetch.mockImplementationOnce(() => Promise.resolve(createFetchResponse(true, 200, mockData)));

    const dataToSend = { instruction: 'Test instruction', rows: [] };
    const response = await saveConfigurationDataApi(dataToSend);

    // Check if the response matches the mock data
    expect(response).toEqual(mockData);
  });


});
