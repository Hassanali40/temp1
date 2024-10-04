import { Question, Session, ChatHistoryTurn } from '../interfaces/session';
import { QAsService } from '../services';
import { useGlobalStore } from '../store';

const QUERY_INTERVAL = 1000;
const API = QAsService.getInstance();

export default function useSubmitPrompt() {
  const updateSession = useGlobalStore((state) => state.updateSession);
  /* const { settings: adminSettings } = useContext(AdminSettingsContext);
  const { user } = useContext(UserContext);*/

  const TASK_STATE_WAITING = 0;
  const TASK_STATE_RUNNING = 1;
  const TASK_STATE_SUCCESS = 2;
  const TASK_STATE_ERROR = 3;
  const TASK_STATE_CANCELLED = 4;

  const buildProfileRequest = (session: Session, question: Question, profileId: string, seed: number) => {
    return {
      session_id: session.id,
      profile_id: profileId,
      generate_qa: true,
      keep_messages: true, //adminSettings.getAgentMessages,
      history: buildHistory(session, question, profileId),
      seed,
    };
  };

  const buildHistory = (session: Session, question: Question, profileId: string): ChatHistoryTurn[] => {
    const history =
      session.qas?.map((qa) => ({
        profile_id: qa.question.promptId,
        user: qa.question.text,
        bot: qa.answer.answer,
        agents_status: qa.answer.agentsStatus,
      })) || [];
    const currentTurn: ChatHistoryTurn = {
      user: question.text,
      profile_id: profileId,
      bot: undefined,
    };
    return [...history, currentTurn];
  };

  const submitQuestion = async (session: Session, _file?: File) => {
    const [promptId, text] = [session.inputPromptId, session.inputText];
    const seed = Math.floor(Math.random() * 65536);
    const question: Question = { promptId, text, seed };

    updateSession(session.id, {
      ...session,
      isWaiting: true,
      currentRecordingTimer: 0,
    });

    try {
      // appInsightsEvent({ name: "Question Submitted", properties: { user, sessionId: session.id, profileId: promptId } });
      const request = buildProfileRequest(session, question, promptId, seed);
      const message = await API.agentChatWithPollingStart(request);
      if (!message) return;
      const taskId = message.task_id;
      session.taskId = taskId;
      setTimeout(() => QueryChartProgress(session), QUERY_INTERVAL);
      updateSession(session.id, { taskId });
    } catch (error) {
      console.log('submitQuestion error event: ', error);
      /*  showAlert(`Error submitting the prompt: ${error}`);
            appInsightsEvent({
                name: "Question Submit Error",
                properties: { user, sessionId: session.id, profileId: promptId, message: `${error}` }
            });*/
      updateSession(session.id, { isWaiting: false, agentsStatus: [] });
    }
  };

  const QueryChartProgress = async (session: Session) => {
    try {
      const chartInfo = await API.agentChatWithPollingStatus(session.taskId);

      switch (chartInfo.state) {
        case TASK_STATE_WAITING:
          setTimeout(() => QueryChartProgress(session), QUERY_INTERVAL / 2);
          break;
        case TASK_STATE_RUNNING:
          if (chartInfo.agents_status === null) return;
          updateSession(session.id, { agentsStatus: chartInfo.agents_status });
          setTimeout(() => QueryChartProgress(session), QUERY_INTERVAL);
          break;
        case TASK_STATE_SUCCESS:
          HandleChartSuccess(session, chartInfo);
          break;
        case TASK_STATE_ERROR:
          HandleChartError(session);
          break;
        case TASK_STATE_CANCELLED:
          HandleChartCancel(session);
          break;
      }
    } catch (_error) {
      //    showAlert(`Error querying the chart progress: ${error}`);

      updateSession(session.id, {
        isWaiting: false,
        agentsStatus: [],
        taskId: '',
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const HandleChartSuccess = async (session: Session, chartInfo: any) => {
    const sessionName = chartInfo?.session_name;
    const qa = chartInfo.qa;
    const current_qas = session.qas || [];

    updateSession(session.id, {
      qas: [...current_qas, qa],
      inputText: '',
      inputPromptId: '',
      isWaiting: false,
      agentsStatus: [],
      taskId: '',
    });

    if (sessionName) {
      updateSession(session.id, { name: sessionName });
    }
  };

  const HandleChartError = async (session: Session) => {
    // showAlert("Error generating the response");
    updateSession(session.id, {
      isWaiting: false,
      agentsStatus: [],
      taskId: '',
    });
  };

  const HandleChartCancel = async (session: Session) => {
    updateSession(session.id, {
      isWaiting: false,
      agentsStatus: [],
      taskId: '',
    });
  };

  const scheduleQueryChartProgress = (session: Session) =>
    setTimeout(() => QueryChartProgress(session), QUERY_INTERVAL);

  return {
    submitQuestion,
    QueryChartProgress,
    HandleChartSuccess,
    HandleChartError,
    HandleChartCancel,
    scheduleQueryChartProgress,
  };
}
