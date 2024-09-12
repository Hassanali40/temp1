import { useRef, useState, useEffect } from "react";
import {
  SpeechRecognizer,
  ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { v4 as uuidv4 } from "uuid";
import SuperCubeLogo from "../../assets/SuperCubeLogo.svg";
import StopWatch from "../../assets/StopWatch.svg";
import PodCast from "../../assets/PodCast.svg";
import BarChart from "../../assets/BarChart.svg";
import Upload from "../../assets/Upload.svg";
import { multiLingualSpeechRecognizer } from "../../util/SpeechToText";

import {
  ChatMessage,
  ConversationRequest,
  customConversationApi,
  ChatResponse,
} from "../../api";
import { QuestionInput } from "../../main-components/QuestionInput";
import { MainCard } from "../../main-components/MainCard";
import SideMenu from "../../main-components/SideMenu/SideMenu";
import SmallSideBar from "../../main-components/SideMenuSmall/SideMenuSmall";

const Chat = () => {
  const lastQuestionRef = useRef<string>("");
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [activeCitation, setActiveCitation] =
    useState<
      [
        content: string,
        id: string,
        title: string,
        filepath: string,
        url: string,
        metadata: string
      ]
    >();
  const [isCitationPanelOpen, setIsCitationPanelOpen] =
    useState<boolean>(false);
  const [answers, setAnswers] = useState<ChatMessage[]>([]);
  const abortFuncs = useRef([] as AbortController[]);
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const [userMessage, setUserMessage] = useState("");
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const questionFileInputRef = useRef<{ triggerClick: () => void, clearFileInput: () => void } | null>(null);

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
      role: "user",
      content: recognizedText || question,
    };
    if (file) {
      console.log(file)
    }
    const request: ConversationRequest = {
      id: conversationId,
      messages: [...answers, userMessage],
      ...(file !== undefined ? { file: file } : {}),
    };

    let result = {} as ChatResponse;
    try {
      const response = await customConversationApi(
        request,
        abortController.signal
      );
      if (response?.body) {
        const reader = response.body.getReader();
        let runningText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          objects.forEach((obj) => {
            try {
              runningText += obj;
              result = JSON.parse(runningText);
              setShowLoadingMessage(false);
              if (result.error) {
                setAnswers([
                  ...answers,
                  userMessage,
                  { role: "error", content: result.error },
                ]);
              } else {
                setAnswers([
                  ...answers,
                  userMessage,
                  ...result.choices[0].messages,
                ]);
              }
              runningText = "";
            } catch { }
          });
        }
        setAnswers([...answers, userMessage, ...result.choices[0].messages]);
        questionFileInputRef.current?.clearFileInput();
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        console.error(result);
        alert(
          "An error occurred. Please try again. If the problem persists, please contact the site administrator."
        );
      }
      setAnswers([...answers, userMessage]);
    } finally {
      setIsLoading(false);
      setShowLoadingMessage(false);
      abortFuncs.current = abortFuncs.current.filter(
        (a) => a !== abortController
      );
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
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync(() => {
          recognizerRef.current?.close();
        });
      }
      setIsRecognizing(false);
      setRecognizedText("");
      setIsListening(false);
    }
  };

  const onMicrophoneClick = async () => {
    if (!isRecognizing) {
      await startSpeechRecognition();
    } else {
      stopSpeechRecognition();
      setRecognizedText(userMessage);
    }
  };


  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );


  return (
    <div className="flex flex-1 flex-col h-full bg-[#FEF6EE]">
      <div className="flex flex-1 p-[30px] pr-[30px] pb-[20px] pl-[15px]">
        <div className="flex w-full">

          {isMenuOpen ?
            <SideMenu isOpen={isMenuOpen} closeMenu={toggleMenu} /> :
            <SmallSideBar toggleMenu={toggleMenu} />
          }

          <div className="flex flex-1 w-full h-full bg-[#fff] shadow-md rounded-lg overflow-auto flex-col">
            <div className="flex flex-1 flex-col h-full bg-[#fff]">
              <div className="flex flex-1 px-6 py-5">
                <div className="flex flex-col flex-grow mx-auto w-[95%]">
                  <div className="flex flex-row items-center gap-5">
                    <div>
                      <img src={SuperCubeLogo} className="h-20 w-20" aria-hidden="true" />
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
                    <h2 className="text-[#667085] text-sm font-semibold">
                      Need expert help? Just Ask!
                    </h2>
                    <div className="flex flex-row flex-wrap gap-6">
                      <MainCard
                        text="Analyze hourly ER arrival patterns for this week."
                        imgSrc={StopWatch}
                      />
                      <MainCard
                        text="Suggest staffing adjustments for low-traffic periods."
                        imgSrc={PodCast}
                      />
                      <MainCard
                        text="Identify trends in ER arrivals by hour and day of the week."
                        imgSrc={BarChart}
                      />
                      <MainCard
                        text="Analyze hourly ER arrival patterns for this week."
                        imgSrc={StopWatch}
                      />
                      <MainCard
                        text="Use this raw data from the last 12 months of our throughput metrics."
                        imgSrc={Upload}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <Button>Click Me!</Button> */}

            <div className="w-full pr-[62px] mb-5 flex flex-col justify-center items-center">
              <div className="w-[95%] h-[51px]">
                <QuestionInput
                  clearOnSend
                  placeholder="Ask any question"
                  disabled={isLoading}
                  onSend={(question, file) => makeApiRequest(question, file)}
                  recognizedText={recognizedText}
                  onMicrophoneClick={onMicrophoneClick}
                  onStopClick={stopSpeechRecognition}
                  isListening={isListening}
                  isRecognizing={isRecognizing}
                  setRecognizedText={setRecognizedText}
                  ref={questionFileInputRef}
                />
              </div>
              <p className="text-[#667085] text-center text-xs font-normal mt-2">Please ensure to check generated information. SuperCube can make mistakes.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
