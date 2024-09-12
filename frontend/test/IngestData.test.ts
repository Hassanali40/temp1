import { describe, expect, it, vi } from 'vitest';
import {saveIngestDataApi} from '../src/api/api.ts'
import { IngestDataResponse } from '../src/api/models.ts';

const url = 'localhost:5173';

// Mock fetch globally
global.fetch = vi.fn();

const createFetchResponse = (ok: boolean, status: number, data: IngestDataResponse[]) => ({
  ok: ok,
  status: status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: () => Promise.resolve(data),
});
const mockData = [{ url: 'http://temp.com', keywords: ''}];

describe('Ingest data get call', () => {

  it('successfully handles a config response when ok', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve(createFetchResponse(true, 200, mockData)));
    
    const response = await fetch(`${url}/api/get_config`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    // Check if the data matches the mock data
    expect(data).toEqual(mockData);
  });

  it('successfully posts ingest data and returns response', async () => {
    const mockData = { success: true };
    fetch.mockImplementationOnce(() => Promise.resolve(createFetchResponse(true, 200, mockData)));

    const dataToSend = [{ url: 'http://temp.com', keywords: ''}];
    const response = await saveIngestDataApi(dataToSend);

    expect(response).toEqual(mockData);
  });

});
