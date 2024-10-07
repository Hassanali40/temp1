import React, { useRef, useState, useEffect, Fragment } from 'react';
import { QA } from '../../interfaces/session';
import { AnswerBubble } from '../AnswerBubble';
import { UserData } from '../../interfaces/user';
import { useGlobalStore } from '../../store';
import { MainCard } from '../../main-components/MainCard';
import { SuperCubeLogo, StopWatch, PodCast, BarChart, Upload } from '../../assets';
import { QuestionBubble } from '../QuestionBubble';

export default function Chat() {
  // const { submitQuestion } = useSubmitQuestion();
  const { activeSession } = useGlobalStore();
  // const [selectedAnswer, setSelectedAnswer] = useState<number>(0);

  const [_abortController, setAbortController] = useState<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [UserDetails, setUserDetails] = useState<UserData>();
  const getUser = useGlobalStore((state) => state.getUser);
  const isBeenRendered = useRef<boolean>(false);

  /*  useEffect(() => {
        if (isInitialized && activeSession && activeSession.id) {
            setActiveAnalysisPanelTab(undefined);
            if (activeSession.wasLoaded || activeSession.isLoading) return;

            updateSession(activeSession.id, { qas: [], isLoading: true });
            const fetchData = async (session: Session) => {
                const qas = await API.getQAs(session.id);
                updateSession(session.id, { qas, isLoading: false, wasLoaded: true });
                session.qas = qas;
                if (session?.taskId) {
                    console.log("active task found, querying chart progress", session.id, session.taskId);
                    updateSession(session.id, { isWaiting: true }); // ??
                    session.isWaiting = true; // ??
                    scheduleQueryChartProgress(session);
                }
            };
            fetchData(activeSession);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession?.id]);*/

  useEffect(() => {
    setAbortController(new AbortController());
  }, []);

  /* const cancelGenerationClicked = async () => {
        if (abortController) {
            abortController.abort();
        }
        if (activeSession?.taskId) {
            updateSession(activeSession.id, { isWaiting: false });
            HandleChartCancel(activeSession);
            await API.agentChatWithPollingCancel(activeSession.taskId);
        }
    };*/

  const isWorking = activeSession?.isWaiting || activeSession?.isStreaming || false; // is the active session doing something?
  const qas: QA[] = activeSession?.qas || [];
  const qaCount: number = activeSession?.qas?.length || 0;

  useEffect(() => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTop = chatContainerRef.current?.scrollHeight;
  }, [activeSession?.isWaiting]);

  useEffect(() => {
    if (!isBeenRendered.current) {
      getUser().then((res) => setUserDetails(res));
      isBeenRendered.current = true;
    }
  }, [getUser]);

  if (activeSession?.isLoading) {
    return (
      <div className="flex flex-1 flex-col relative items-center w-full overflow-y-auto">
        <div className="flex-grow max-w-[1028px] w-full pt-8 px-6 flex flex-col">
          <div className="flex-grow flex flex-col justify-center items-center pt-15 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex flex-1 flex-col relative items-center w-full overflow-y-auto" ref={chatContainerRef}>
        <div className="flex-grow max-w-[1028px] w-full pt-8 px-6 pl-11 flex flex-col">
          {(!qaCount && !isWorking) || !activeSession ? (
            <div className="flex flex-1 px-6 py-5">
              <div className="flex flex-col flex-grow mx-auto w-[95%]">
                <div className="flex flex-row items-center gap-5">
                  <div>
                    <img src={SuperCubeLogo} className="h-20 w-20" aria-hidden="true" alt="logo from supercube" />
                  </div>
                  <div>
                    <h1 className="text-transparent bg-gradient-to-r from-[#7B6AE0] to-[#FFBB89] bg-clip-text text-4xl font-bold leading-none">
                      Welcome,{UserDetails ? UserDetails?.name : "John"}.
                    </h1>
                    <h2 className="text-[#E04F16] text-4xl font-bold	 leading-none mt-2">
                      What can we help you with today?
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col mt-12 gap-5">
                  <h2 className="text-[#667085] font-semibold dark:text-white mt-12">Need expert help? Just Ask!</h2>
                  <div className="flex flex-row gap-6">
                    <MainCard text="Analyze hourly ER arrival patterns for this week." imgSrc={StopWatch} />
                    <MainCard text="Suggest staffing adjustments for low-traffic periods." imgSrc={PodCast} />
                    <MainCard text="Identify trends in ER arrivals by hour and day of the week." imgSrc={BarChart} />
                    <MainCard text="Analyze hourly ER arrival patterns for this week." imgSrc={StopWatch} />
                    <MainCard
                      text="Use this raw data from the last 12 months of our throughput metrics."
                      imgSrc={Upload}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col">
              {qas.map((qa, index) => (
                <div key={index}>
                  <QuestionBubble question={qa.question} />
                  <AnswerBubble
                    qa={qa}
                    isSelected={false}
                    isLoading={activeSession.isStreaming && index === qas.length - 1}
                  />
                </div>
              ))}

              {activeSession.isWaiting && (
                <>
                  <QuestionBubble
                    question={{
                      promptId: activeSession.inputPromptId,
                      text: activeSession.inputText,
                      seed: 0,
                    }}
                  />

                  <AnswerBubble isLoading={activeSession.isWaiting} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
