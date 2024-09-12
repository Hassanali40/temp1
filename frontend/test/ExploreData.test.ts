import { describe, expect, it, vi } from 'vitest';
import {getExploreDataFileDetailsApi} from '../src/api/api.ts'
const url = 'localhost:5173';

// Mock fetch globally
global.fetch = vi.fn();

const createFetchResponse = (ok: boolean, status: number, data: any[]) => ({
  ok: ok,
  status: status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: () => Promise.resolve(data),
});
const mockData = [{ id: '`12', name: 'file1', url: 'http://file1'}];
const mockData1 = [{ chunkId: '`12', content: 'file1 details', url: 'http://file1'}];

describe('Ingest data get call', () => {

  it('successfully handles a config response when ok', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve(createFetchResponse(true, 200, mockData)));
    
    const response = await fetch(`${url}/api/expore_data_file`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    // Check if the data matches the mock data
    expect(data).toEqual(mockData);
  });

  it('successfully posts ingest data and returns response', async () => {
    // const mockData = { success: true };
    fetch.mockImplementationOnce(() => Promise.resolve(createFetchResponse(true, 200, mockData1)));

    // const data = [{ id: '`12', name: 'file1', url: 'http://file1'}];
    const response = await getExploreDataFileDetailsApi();

    // Check if the response matches the mock data
    expect(response).toEqual(mockData1);
  });


});
