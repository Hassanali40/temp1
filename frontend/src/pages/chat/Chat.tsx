import { useRef, useState, useEffect } from "react";
import { Stack } from "@fluentui/react";
import {
  BroomRegular,
  DismissRegular,
  SquareRegular,
  AttachTextRegular,
} from "@fluentui/react-icons";
import {
  SpeechRecognizer,
  ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { v4 as uuidv4 } from "uuid";

import styles from "./Chat.module.css";


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
  Citation,
  ToolMessageContent,
  ChatResponse,
} from "../../api";
import { Answer } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { MainCard } from "../../components/MainCard";
import SideMenu from "../../components/SideMenu/SideMenu";
import SmallSideBar from "../../components/SideMenuSmall/SideMenuSmall";

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
      // console.log("Stopping continuous recognition...");
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync(() => {
          // console.log("Speech recognition stopped.");
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
      // console.log("Starting speech recognition...");
      await startSpeechRecognition();
    } else {
      // console.log("Stopping speech recognition...");
      stopSpeechRecognition();
      setRecognizedText(userMessage);
    }
  };

  const onFileAttachmentClick = () => {
    console.log('onFileAttachmentClick')
    questionFileInputRef.current?.triggerClick();
  };

  const clearChat = () => {
    lastQuestionRef.current = "";
    setActiveCitation(undefined);
    setAnswers([]);
    setConversationId(uuidv4());
  };

  const stopGenerating = () => {
    abortFuncs.current.forEach((a) => a.abort());
    setShowLoadingMessage(false);
    setIsLoading(false);
  };

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );

  const onShowCitation = (citation: Citation) => {
    setActiveCitation([
      citation.content,
      citation.id,
      citation.title ?? "",
      citation.filepath ?? "",
      "",
      "",
    ]);
    setIsCitationPanelOpen(true);
  };

  const parseCitationFromMessage = (message: ChatMessage) => {
    if (message.role === "tool") {
      try {
        const toolMessage = JSON.parse(message.content) as ToolMessageContent;
        return toolMessage.citations;
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div className={styles.container}>
      <Stack horizontal className={styles.chatRoot}>
        <div className={styles.chatContainerMain}>

          {isMenuOpen ?
            <SmallSideBar toggleMenu={toggleMenu} /> :
            <SideMenu isOpen={isMenuOpen} closeMenu={toggleMenu} />}

          <div className={`${styles.chatContainer} ${styles.MobileChatContainer}`}>

            {!lastQuestionRef.current ? (
              <Stack className={styles.chatEmptyStateContainer}>
                <Stack className={styles.chatEmptyState}>
                  <div>
                    <img src={SuperCubeLogo} className={styles.chatIcon} aria-hidden="true" />
                  </div>
                  <div>
                    <h1 className={styles.chatEmptyStateTitle} >Welcome, John.</h1>
                    <h2 className={styles.chatEmptyStateSubtitle}>
                      What can we help you with today?
                    </h2>
                  </div>
                </Stack>
                <Stack className={styles.chatEmptyStateCenter}>
                  <div>
                    <h2 className={styles.chatEmptyStateCenterTitle}>
                      Need expert help? Just Ask!
                    </h2>
                  </div>
                  <div className={styles.chatEmptyStateCenterCards}>
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
                </Stack>
              </Stack>
            ) : (
              <div
                className={styles.chatMessageStream}
                style={{ marginBottom: isLoading ? "40px" : "0px" }}
              >
                {answers.map((answer, index) => (
                  <>
                    {answer.role === "user" ? (
                      <div className={styles.chatMessageUser}>
                        <div className={styles.chatMessageUserMessage}>
                          {answer.content}
                        </div>
                      </div>
                    ) : answer.role === "assistant" || answer.role === "error" ? (
                      <div className={styles.chatMessageGpt}>
                        <Answer
                          answer={{
                            answer:
                              answer.role === "assistant"
                                ? answer.content
                                : "Sorry, an error occurred. Try refreshing the conversation or waiting a few minutes. If the issue persists, contact your system administrator. Error: " +
                                answer.content,
                            citations:
                              answer.role === "assistant"
                                ? parseCitationFromMessage(answers[index - 1])
                                : [],
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
                    <div className={styles.chatMessageUser}>
                      <div className={styles.chatMessageUserMessage}>
                        {lastQuestionRef.current}
                      </div>
                    </div>
                    <div className={styles.chatMessageGpt}>
                      <Answer
                        answer={{
                          answer: "Generating answer...",
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
            <div>
              {isRecognizing && !isListening && <p>Please wait...</p>}{" "}
              {isListening && <p>Listening...</p>}{" "}
            </div>

            <Stack horizontal className={styles.chatInput}>
              {isLoading && (
                <Stack
                  horizontal
                  className={styles.stopGeneratingContainer}
                  role="button"
                  aria-label="Stop generating"
                  tabIndex={0}
                  onClick={stopGenerating}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " " ? stopGenerating() : null
                  }
                >
                  <SquareRegular
                    className={styles.stopGeneratingIcon}
                    aria-hidden="true"
                  />
                  <span className={styles.stopGeneratingText} aria-hidden="true">
                    Stop generating
                  </span>
                </Stack>
              )}
              <Stack >
                <BroomRegular
                  className={`${styles.clearChatBroom} ${styles.mobileclearChatBroom}`}
                  style={{
                    background:
                      isLoading || answers.length === 0
                        ? "#BDBDBD"
                        : "radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)",
                    cursor: isLoading || answers.length === 0 ? "" : "pointer",
                  }}
                  onClick={clearChat}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " " ? clearChat() : null
                  }
                  aria-label="Clear session"
                  role="button"
                  tabIndex={0}
                />
                <AttachTextRegular
                  className={`${styles.fileAttachmentChat} ${styles.mobilefileAttachmentChat}`}
                  style={{
                    background:
                      isLoading
                        ? "#BDBDBD"
                        : "radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)",
                    cursor: isLoading ? "" : "pointer",
                  }}
                  onClick={onFileAttachmentClick}
                />
              </Stack>

              <QuestionInput
                clearOnSend
                placeholder="Type a new question..."
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
            </Stack>
          </div>
        </div>
        {answers.length > 0 && isCitationPanelOpen && activeCitation && (
          <Stack.Item className={`${styles.citationPanel} ${styles.mobileStyles}`}>
            <Stack
              horizontal
              className={styles.citationPanelHeaderContainer}
              horizontalAlign="space-between"
              verticalAlign="center"
            >
              <span className={styles.citationPanelHeader}>Citations</span>
              <DismissRegular
                className={styles.citationPanelDismiss}
                onClick={() => setIsCitationPanelOpen(false)}
              />
            </Stack>
            <h5 className={`${styles.citationPanelTitle} ${styles.mobileCitationPanelTitle}`}>{activeCitation[2]}</h5>
            <ReactMarkdown
              className={`${styles.citationPanelContent} ${styles.mobileCitationPanelContent}`}
              children={activeCitation[0]}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            />
          </Stack.Item>
        )}
      </Stack>
    </div>
  );
};

export default Chat;
