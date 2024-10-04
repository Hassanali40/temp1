import { useRef, useState, useEffect, useContext } from 'react';
import { SpeechRecognizer, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import { SquareRegular } from '@fluentui/react-icons';
import { v4 as uuidv4 } from 'uuid';
import { multiLingualSpeechRecognizer } from '../../util/SpeechToText';
import {
  ChatMessage,
  ConversationRequest,
  customConversationApi,
  ChatResponse,
  Citation,
  ToolMessageContent,
} from '../../api';
import { QuestionInput } from '../../main-components/QuestionInput';
import { Answer } from '../../main-components/Answer.js';
import { MainCard } from '../../main-components/MainCard';
import SideMenu from '../../main-components/SideMenu/SideMenu';
import SmallSideBar from '../../main-components/SideMenuSmall/SideMenuSmall';
import { AppContextTheme } from '../../store/context/AppContext';
import {
  SuperCubeLogo,
  StopWatch,
  PodCast,
  UploadImageIcon,
  BarChart,
  FileUploadIcon,
  Microsoft,
  Upload,
} from '../../assets';

const Chat = () => {
  const context = useContext(AppContextTheme);

  if (!context) {
    throw new Error('useContext must be used within an AppContextTheme.Provider');
  }

  const lastQuestionRef = useRef<string>('');
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [_activeCitation, setActiveCitation] =
    useState<[content: string, id: string, title: string, filepath: string, url: string, metadata: string]>();
  const [_isCitationPanelOpen, setIsCitationPanelOpen] = useState<boolean>(false);
  const [answers, setAnswers] = useState<ChatMessage[]>([]);
  const abortFuncs = useRef([] as AbortController[]);
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const [userMessage, setUserMessage] = useState('');
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOpenOption, setIsOpenOption] = useState<boolean>(false);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const questionFileInputRef = useRef<{ triggerClick: () => void; clearFileInput: () => void } | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const makeApiRequest = async (question: string, file?: File) => {
    lastQuestionRef.current = question;

    setIsLoading(true);
    setShowLoadingMessage(true);
    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    const userMessage: ChatMessage = {
      role: 'user',
      content: recognizedText || question,
    };
    if (file) {
      console.log(file);
    }
    const request: ConversationRequest = {
      id: conversationId,
      messages: [...answers, userMessage],
      ...(file !== undefined ? { file: file } : {}),
    };

    let result = {} as ChatResponse;
    try {
      const response = await customConversationApi(request, abortController.signal);
      if (response?.body) {
        const reader = response.body.getReader();
        let runningText = '';
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = new TextDecoder('utf-8').decode(value);
          const objects = text.split('\n');
          objects.forEach((obj) => {
            try {
              runningText += obj;
              result = JSON.parse(runningText);
              setShowLoadingMessage(false);
              if (result.error) {
                setAnswers([...answers, userMessage, { role: 'error', content: result.error }]);
              } else {
                setAnswers([...answers, userMessage, ...result.choices[0].messages]);
              }
              runningText = '';
            } catch {
              console.log('error');
            }
          });
        }
        setAnswers([...answers, userMessage, ...result.choices[0].messages]);
        questionFileInputRef.current?.clearFileInput();
      }
    } catch (_e) {
      if (!abortController.signal.aborted) {
        console.error(result);
        alert('An error occurred. Please try again. If the problem persists, please contact the site administrator.');
      }
      setAnswers([...answers, userMessage]);
    } finally {
      setIsLoading(false);
      setShowLoadingMessage(false);
      abortFuncs.current = abortFuncs.current.filter((a) => a !== abortController);
    }

    return abortController.abort();
  };

  const startSpeechRecognition = async () => {
    if (!isRecognizing) {
      setIsRecognizing(true);

      recognizerRef.current = await multiLingualSpeechRecognizer(); // Store the recognizer in the ref

      recognizerRef.current.recognized = (s, e) => {
        if (e.result.reason === ResultReason.RecognizedSpeech) {
          const recognized = e.result.text;
          setUserMessage(recognized);
          setRecognizedText(recognized);
        }
      };

      recognizerRef.current.startContinuousRecognitionAsync(() => {
        setIsRecognizing(true);
        setIsListening(true);
      });
    }
  };

  const stopSpeechRecognition = () => {
    if (isRecognizing) {
      // console.log("Stopping continuous recognition...");
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync(() => {
          // console.log("Speech recognition stopped.");
          recognizerRef.current?.close();
        });
      }
      setIsRecognizing(false);
      setRecognizedText('');
      setIsListening(false);
    }
  };

  const onMicrophoneClick = async () => {
    if (!isRecognizing) {
      // console.log("Starting speech recognition...");
      await startSpeechRecognition();
    } else {
      // console.log("Stopping speech recognition...");
      stopSpeechRecognition();
      setRecognizedText(userMessage);
    }
  };

  const onFileAttachmentClick = () => {
    console.log('onFileAttachmentClick ====>');
    questionFileInputRef.current?.triggerClick();
  };

  const _clearChat = () => {
    lastQuestionRef.current = '';
    setActiveCitation(undefined);
    setAnswers([]);
    setConversationId(uuidv4());
  };

  const stopGenerating = () => {
    abortFuncs.current.forEach((a) => a.abort());
    setShowLoadingMessage(false);
    setIsLoading(false);
  };

  useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: 'smooth' }), [showLoadingMessage]);

  const onShowCitation = (citation: Citation) => {
    setActiveCitation([citation.content, citation.id, citation.title ?? '', citation.filepath ?? '', '', '']);
    setIsCitationPanelOpen(true);
  };

  const parseCitationFromMessage = (message: ChatMessage) => {
    if (message.role === 'tool') {
      try {
        const toolMessage = JSON.parse(message.content) as ToolMessageContent;
        return toolMessage.citations;
      } catch {
        return [];
      }
    }
    return [];
  };


  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsOpenOption(!isOpenOption);
  };



  return (
    <div className="flex flex-1 flex-col h-full bg-[#FEF6EE] dark:bg-[#1A202C]">
      <div className="flex flex-1 p-7 pr-7 pb-5 pl-5">
        <div className="flex w-full">
          {isMenuOpen ? (
            <SideMenu isOpen={isMenuOpen} closeMenu={toggleMenu} />
          ) : (
            <SmallSideBar toggleMenu={toggleMenu} />
          )}

          <div className="flex flex-1 w-full h-full bg-[#fff] dark:bg-[#334054]  dark:border dark:border-white shadow-md rounded-lg overflow-auto flex-col">
            <div className="flex flex-1 flex-col h-full bg-[#fff] dark:bg-[#334054]">
              {!lastQuestionRef.current ? (
                <div className="flex flex-1 px-6 py-5">
                  <div className="flex flex-col flex-grow mx-auto w-[95%]">
                    <div className="flex flex-row items-center gap-5">
                      <div>
                        <img src={SuperCubeLogo} className="h-20 w-20" aria-hidden="true" alt="logo from supercube" />
                      </div>
                      <div>
                        <h1 className="text-transparent bg-gradient-to-r from-[#7B6AE0] to-[#FFBB89] bg-clip-text text-4xl font-bold leading-none">
                          Welcome, John.
                        </h1>
                        <h2 className="text-[#E04F16] text-4xl font-bold	 leading-none mt-2">
                          What can we help you with today?
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-col mt-12 gap-5">
                      <h2 className="text-[#667085] font-semibold dark:text-white mt-12">
                        Need expert help? Just Ask!
                      </h2>
                      <div className="flex flex-row flex-wrap gap-6">
                        <MainCard text="Analyze hourly ER arrival patterns for this week." imgSrc={StopWatch} />
                        <MainCard text="Suggest staffing adjustments for low-traffic periods." imgSrc={PodCast} />
                        <MainCard
                          text="Identify trends in ER arrivals by hour and day of the week."
                          imgSrc={BarChart}
                        />
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
                <div className="flex-grow max-w-[1028px] w-full overflow-y-auto px-6 flex flex-col mt-6">
                  {answers.map((answer, index) => (
                    <>
                      {answer.role === 'user' ? (
                        <div className="flex justify-end mb-3">
                          <div className="p-5 bg-[#EDF5FD] rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.14),0px_0px_2px_rgba(0,0,0,0.12)] text-[14px] font-normal leading-[22px] text-[#242424] flex-none order-0 flex-grow-0 whitespace-pre-wrap break-words max-w-[800px]">
                            {answer.content}
                          </div>
                        </div>
                      ) : answer.role === 'assistant' || answer.role === 'error' ? (
                        <div className="mb-3 max-w-[80%] flex">
                          <Answer
                            answer={{
                              answer:
                                answer.role === 'assistant'
                                  ? answer.content
                                  : 'Sorry, an error occurred. Try refreshing the conversation or waiting a few minutes. If the issue persists, contact your system administrator. Error: ' +
                                  answer.content,
                              citations:
                                answer.role === 'assistant' ? parseCitationFromMessage(answers[index - 1]) : [],
                            }}
                            onCitationClicked={(c) => onShowCitation(c)}
                            index={index}
                          />
                        </div>
                      ) : null}
                    </>
                  ))}

                  {showLoadingMessage && (
                    <>
                      <div className="flex justify-end mb-3">
                        <div className="p-5 bg-[#EDF5FD] rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.14),0px_0px_2px_rgba(0,0,0,0.12)] text-[14px] font-normal leading-[22px] text-[#242424] flex-none order-0 flex-grow-0 whitespace-pre-wrap break-words max-w-[800px]">
                          {lastQuestionRef.current}
                        </div>
                      </div>
                      <div className="mb-3 max-w-[80%] flex">
                        <Answer
                          answer={{
                            answer: 'Generating answer...',
                            citations: [],
                          }}
                          onCitationClicked={() => null}
                          index={0}
                        />
                      </div>
                    </>
                  )}
                  <div ref={chatMessageStreamEnd} />
                </div>
              )}
            </div>

            <div className="w-full pr-[62px] pb-5 flex flex-col justify-center items-center ">
              <div>
                {isRecognizing && !isListening && <p>Please wait...</p>} {isListening && <p>Listening...</p>}{' '}
              </div>

              {isLoading && (
                <div
                  className="box-border flex flex-row justify-center items-center self-center gap-[6px] w-[201px] h-[32px] border border-[#D1D1D1] rounded-[16px] mb-[15px] "
                  role="button"
                  aria-label="Stop generating"
                  tabIndex={0}
                  onClick={stopGenerating}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? stopGenerating() : null)}
                >
                  <SquareRegular className=" w-[21px] h-[21px]" aria-hidden="true" />
                  <span
                    className=" font-normal text-[14px] leading-[20px] flex items-center text-[#242424]"
                    aria-hidden="true"
                  >
                    Stop generating
                  </span>
                </div>
              )}
              <div className="w-[95%] h-[51px] relative">
                {isOpenOption && (
                  <div className="origin-bottom-right absolute left-0  w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform -translate-y-full">
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={onFileAttachmentClick}
                      >
                        <img src={UploadImageIcon} className="h-5 w-5 mr-3" alt="Upload button" />
                        Upload image
                      </button>
                      <button
                        onClick={onFileAttachmentClick}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <img src={FileUploadIcon} className="h-5 w-5 mr-3" alt="Upload File" />
                        Upload file
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      // onClick={/* Add appropriate onClick handler */}
                      >
                        <img src={Microsoft} className="h-5 w-5 mr-3" alt="Connect OneDrive" />
                        Connect OneDrive
                      </button>
                    </div>
                  </div>
                )}
                <QuestionInput
                  clearOnSend
                  placeholder="Ask any question"
                  disabled={isLoading}
                  onSend={(question, file) => makeApiRequest(question, file)}
                  recognizedText={recognizedText}
                  onMicrophoneClick={onMicrophoneClick}
                  toggleDropdown={toggleDropdown}
                  onStopClick={stopSpeechRecognition}
                  isListening={isListening}
                  isRecognizing={isRecognizing}
                  setRecognizedText={setRecognizedText}
                  ref={questionFileInputRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
