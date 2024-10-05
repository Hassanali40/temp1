import { useRef, useState, useEffect, useContext } from 'react';
import { SpeechRecognizer, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import { SquareRegular } from '@fluentui/react-icons';
import { multiLingualSpeechRecognizer } from '../../util/SpeechToText';
import { QuestionInput } from '../../main-components/QuestionInput';
import { ChatView } from '../../main-components/Chat';
import SideMenu from '../../main-components/SideMenu/SideMenu';
import { AppContextTheme } from '../../store/context/AppContext';
import { UploadImageIcon, FileUploadIcon, Microsoft } from '../../assets';
import { useSubmitQuestion } from '../../hooks';
import useSession from '../../hooks/useSession';
import { Session } from '../../interfaces/session';
import { UserData } from '../../interfaces/user';
import { useGlobalStore } from '../../store';

export default function ChatWrapper() {
  const context = useContext(AppContextTheme);
  const { submitQuestion } = useSubmitQuestion();
  const { createNewSession, activeSession, updateSession } = useSession();

  if (!context) {
    throw new Error('useContext must be used within an AppContextTheme.Provider');
  }


  const lastQuestionRef = useRef<string>('');
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const abortFuncs = useRef([] as AbortController[]);
  const [userMessage, setUserMessage] = useState('');
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const questionFileInputRef = useRef<{ triggerClick: () => void; clearFileInput: () => void } | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmitQuestion = async (question: string, _file?: File) => {
    lastQuestionRef.current = question;

    setIsLoading(true);
    setShowLoadingMessage(true);

    if (activeSession == null) {
      await createNewSession();
    }

    await submitQuestion({ ...useGlobalStore.getState().activeSession, inputText: question } as Session);
    setIsLoading(false);
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
    console.log('onFileAttachmentClick');
    questionFileInputRef.current?.triggerClick();
  };

  const stopGenerating = async () => {
    abortFuncs.current.forEach((a) => a.abort());
    await updateSession(activeSession?.id || '', { isWaiting: false });
  };

  useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: 'smooth' }), [showLoadingMessage]);

  // useEffect(() => {
  //   document.documentElement.classList.add('dark');
  // }, []);

  const [isOpenOption, setIsOpenOption] = useState(false);
  const [UserDetails, setUserDetails] = useState<UserData>();
  const getUser = useGlobalStore((state) => state.getUser);
  const isBeenRendered = useRef<boolean>(false);

  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsOpenOption(!isOpenOption);
  };

  useEffect(() => {
    if (!isBeenRendered.current) {
      getUser().then((res) => setUserDetails(res));
      isBeenRendered.current = true;
    }
  }, [getUser]);

  return (
    <div className="flex w-full h-full bg-[#FEF6EE] dark:bg-[#1A202C] px-4 py-5">
      <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <div className="flex flex-1 w-full min-h-full bg-[#fff] dark:bg-[#334054] dark:border dark:border-white rounded-lg overflow-auto flex-col">
        <div className="flex flex-1 w-full h-full bg-[#fff] dark:bg-[#334054] overflow-auto flex-col">
          <div className="flex flex-1 flex-col h-full bg-[#fff] dark:bg-[#344054]">
            <ChatView
              userData={UserDetails}
            />
          </div>
        </div>

        <div className="w-full pr-[62px] pb-5 flex flex-col justify-center items-center ">
          <div>
            {isRecognizing && !isListening && <p>Please wait...</p>} {isListening && <p>Listening...</p>}{' '}
          </div>

          {activeSession?.isWaiting && (
            <div
              className="box-border flex flex-row justify-center items-center self-center gap-[6px] w-[201px] h-[32px] border border-[#D1D1D1] rounded-[16px] mb-[15px] "
              role="button"
              aria-label="Stop generating"
              tabIndex={0}
              onClick={stopGenerating}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? stopGenerating() : null)}
            >
              <SquareRegular className="w-[21px] h-[21px] dark:text-white" aria-hidden="true" />
              Stop Generating ...
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
              onSend={handleSubmitQuestion}
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
  );
}
