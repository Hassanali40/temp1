import { useRef, useState, useEffect, Fragment } from 'react';
import { QA } from '../../interfaces/session';
import { AnswerBubble } from '../AnswerBubble';
import { useGlobalStore } from '../../store';
import { MainCard } from '../../main-components/MainCard';
import { SuperCubeLogo, StopWatch, PodCast, BarChart, Upload } from '../../assets';
import { QuestionBubble } from '../QuestionBubble';
import { useSessions, useSubmitQuestion } from '../../hooks';
import { SquareRegular } from '@fluentui/react-icons';
import { Button } from '../../DesignSystem';
import { formatUserName } from '../../util';

export default function Chat() {
  const { userData, activeSession } = useGlobalStore();
  const { updateSession, getQAs } = useSessions();
  const { HandleChartCancel } = useSubmitQuestion();

  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeSession && activeSession.id) {
      if (activeSession.wasLoaded || activeSession.isLoading) return;
      getQAs(activeSession.id);
      if (activeSession?.taskId) {
        updateSession(activeSession.id, { isWaiting: true });
        //scheduleQueryChartProgress(session);  -> add this line when we add the abort polling
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.id]);

  useEffect(() => {
    setAbortController(new AbortController());
  }, []);

  const cancelGenerationClicked = async () => {
    updateSession(activeSession?.id || '', { isWaiting: false });
    if (abortController) {
      abortController.abort();
    }
    if (activeSession?.taskId) {
      await HandleChartCancel(activeSession);
    }
  };

  const isWorking = activeSession?.isWaiting || activeSession?.isStreaming || false; // is the active session doing something?
  const qas: QA[] = activeSession?.qas || [];
  const qaCount: number = activeSession?.qas?.length || 0;

  useEffect(() => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTop = chatContainerRef.current?.scrollHeight;
  }, [activeSession?.isWaiting]);

  if (activeSession?.isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <Fragment>
      <div className="flex flex-1 flex-col relative items-center w-full overflow-y-auto" ref={chatContainerRef}>
        <div className="flex-grow max-w-[1028px] w-full px-6 pl-11 flex flex-col md:pt-8 max-md:px-4">
          {(!qaCount && !isWorking) || !activeSession ? (
            <div className="flex flex-1 px-6 py-5 max-md:py-0 max-md:px-0">
              <div className="flex flex-col flex-grow mx-auto w-[95%]">
                <div className="flex flex-row items-center gap-5 max-md:hidden">
                  <div>
                    <img src={SuperCubeLogo} className="h-20 w-20" aria-hidden="true" alt="logo from supercube" />
                  </div>
                  <div>
                    <h1 className="text-transparent bg-gradient-to-r from-[#7B6AE0] to-[#FFBB89] bg-clip-text text-4xl font-bold leading-none">
                      Welcome, {formatUserName(userData.name) || 'friend'}.
                    </h1>
                    <h2 className="text-[#E04F16] text-4xl font-bold	 leading-none mt-2">
                      What can we help you with today?
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col mt-12 gap-5 max-md:mt-auto max-md:mb-12">
                  <h2 className="text-[#667085] font-semibold dark:text-white mt-12">Need expert help? Just Ask!</h2>
                  <div className="flex flex-row gap-6 md:flex-wrap max-md:overflow-x-auto scrollbar-hide">
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
            <div className="flex-grow flex flex-col gap-5">
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
        {activeSession?.isWaiting && (
          <Button
            variant="ghost"
            className="z-50 box-border flex flex-row justify-center items-center self-center gap-[6px] w-[201px] h-[32px] border border-[#D1D1D1] rounded-[16px] mb-[15px] "
            onClick={cancelGenerationClicked}
          >
            <SquareRegular className="w-[21px] h-[21px] dark:text-white" aria-hidden="true" />
            Stop Generating ...
          </Button>
        )}
      </div>
    </Fragment>
  );
}
