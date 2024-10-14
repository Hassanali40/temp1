import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useSubmitPrompt from './useSubmitQuestion';
import { useGlobalStore } from '../store';
import { QAsService } from '../services';
import { Session } from '../interfaces/session';

vi.mock('../store');
vi.mock('../services');

describe('useSubmitPrompt', () => {
  let mockUpdateSession: vi.Mock;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAPIInstance: any;

  const session: Session = {
    id: 'session-id',
    name: 'Test Session',
    created: 0,
    updated: 0,
    qas: [],
    error: '',
    isLoading: false,
    wasLoaded: false,
    isWaiting: false,
    isStreaming: false,
    taskId: '',
    agentsStatus: [],
    isQuerying: false,
    inputText: 'Test question',
    inputPromptId: 'prompt-id',
    currentRecordingTimer: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdateSession = vi.fn();
    (useGlobalStore as vi.Mock).mockReturnValue(mockUpdateSession);

    mockAPIInstance = {
      agentChatWithPollingStart: vi.fn(),
      agentChatWithPollingStatus: vi.fn(),
      agentChatWithPollingCancel: vi.fn(),
    };

    (QAsService.getInstance as vi.Mock).mockReturnValue(mockAPIInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the expected functions', () => {
    const { result } = renderHook(() => useSubmitPrompt());
    expect(result.current).toHaveProperty('submitQuestion');
    expect(result.current).toHaveProperty('QueryChartProgress');
    expect(result.current).toHaveProperty('HandleChartSuccess');
    expect(result.current).toHaveProperty('HandleChartError');
    expect(result.current).toHaveProperty('HandleChartCancel');
    expect(result.current).toHaveProperty('scheduleQueryChartProgress');
  });

  it('submitQuestion should handle API errors', async () => {
    const { result } = renderHook(() => useSubmitPrompt());

    mockAPIInstance.agentChatWithPollingStart.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      await result.current.submitQuestion(session);
    });

    expect(mockUpdateSession).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        isWaiting: false,
        agentsStatus: [],
      }),
    );
  });

  it('QueryChartProgress should handle TASK_STATE_ERROR', async () => {
    const { result } = renderHook(() => useSubmitPrompt());

    mockAPIInstance.agentChatWithPollingStatus.mockResolvedValue({ state: 3 });

    await act(async () => {
      await result.current.QueryChartProgress(session);
    });

    expect(mockUpdateSession).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        isWaiting: false,
        agentsStatus: [],
        taskId: '',
      }),
    );
  });

  it('QueryChartProgress should handle TASK_STATE_CANCELLED', async () => {
    const { result } = renderHook(() => useSubmitPrompt());

    mockAPIInstance.agentChatWithPollingStatus.mockResolvedValue({ state: 4 });

    await act(async () => {
      await result.current.QueryChartProgress(session);
    });

    expect(mockUpdateSession).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        isWaiting: false,
        agentsStatus: [],
        taskId: '',
      }),
    );
  });

  it('HandleChartSuccess should update session correctly', async () => {
    const { result } = renderHook(() => useSubmitPrompt());

    const qa = { question: { text: 'Q' }, answer: { answer: 'A' } };
    const chartInfo = {
      qa,
      session_name: 'Updated Session Name',
    };

    await act(async () => {
      await result.current.HandleChartSuccess(session, chartInfo);
    });

    expect(mockUpdateSession).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        qas: [qa],
        inputText: '',
        inputPromptId: '',
        isWaiting: false,
        agentsStatus: [],
        taskId: '',
      }),
    );

    expect(mockUpdateSession).toHaveBeenCalledWith(session.id, { name: 'Updated Session Name' });
  });

  it('HandleChartError should update session correctly', async () => {
    const { result } = renderHook(() => useSubmitPrompt());

    await act(async () => {
      await result.current.HandleChartError(session);
    });

    expect(mockUpdateSession).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        isWaiting: false,
        agentsStatus: [],
        taskId: '',
      }),
    );
  });

  it('HandleChartCancel should update session correctly', async () => {
    const { result } = renderHook(() => useSubmitPrompt());
    mockAPIInstance.agentChatWithPollingCancel.mockResolvedValue('1234');

    await act(async () => {
      await result.current.HandleChartCancel(session);
    });

    expect(mockUpdateSession).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        isWaiting: false,
        agentsStatus: [],
        taskId: '',
      }),
    );
  });
});
