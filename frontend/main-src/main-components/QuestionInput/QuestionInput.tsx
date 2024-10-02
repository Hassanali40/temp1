import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useContext } from 'react';
import { AppContextTheme } from '../../store/context/AppContext';
import { CirclePlus, CirclePlusWhite, FileIcon, MicrophoneIcon, MicrophoneIconBlue, SendBtn, SendBtnWhite } from '../../assets';

interface Props {
  onSend: (question: string, file?: File) => void;
  onMicrophoneClick: () => void;
  toggleDropdown: () => void;
  onStopClick: () => void;
  disabled: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
  recognizedText: string;
  isListening: boolean;
  isRecognizing: boolean;
  setRecognizedText: (text: string) => void;
}

// eslint-disable-next-line react/display-name
export const QuestionInput = forwardRef<{ triggerClick: () => void; clearFileInput: () => void }, Props>(
  (
    {
      onSend,
      onMicrophoneClick,
      toggleDropdown,
      onStopClick,
      disabled,
      placeholder,
      clearOnSend,
      recognizedText,
      isListening,
      isRecognizing,
      setRecognizedText,
    },
    ref,
  ) => {
    const context = useContext(AppContextTheme);
    if (!context) {
      throw new Error('useContext must be used within an AppContextTheme.Provider');
    }
    const { isDarkMode } = context;
    const [question, setQuestion] = useState<string>('');
    const [liveRecognizedText, setLiveRecognizedText] = useState<string>('');
    const [microphoneIconActive, setMicrophoneIconActive] = useState<boolean>(false);
    const [file, setFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string>(''); // New state to store file name
    const [uploadProgress, setUploadProgress] = useState<number>(0);


    useEffect(() => {
      if (isRecognizing) {
        setLiveRecognizedText(recognizedText);
        setMicrophoneIconActive(true); // Set microphone icon to active (blue)
      } else {
        setMicrophoneIconActive(false); // Set microphone icon to inactive
      }
    }, [recognizedText, isRecognizing]);
    const sendQuestion = () => {
      if (disabled || (!question.trim() && !liveRecognizedText.trim())) {
        return;
      }

      const textToSend = question || liveRecognizedText;

      onSend(textToSend, file);

      if (clearOnSend) {
        setQuestion('');
        setLiveRecognizedText('');
        setRecognizedText(''); // Clear recognizedText
        // setFile(undefined)
      }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || !event.target.files) {
        return;
      }
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      toggleDropdown()
      simulateUploadProgress();
    };

    const simulateUploadProgress = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
        }
        setUploadProgress(progress);
      }, 300); // Simulates progress update every 500ms
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        sendQuestion();
      }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setQuestion(newValue || '');
      setLiveRecognizedText(newValue || ''); // Update liveRecognizedText when edited
    };

    useImperativeHandle(ref, () => ({
      triggerClick: () => {
        fileInputRef.current?.click();
      },
      clearFileInput: () => {
        setFile(undefined);
        setFileName('');
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
    }));

    const _sendQuestionDisabled = disabled || !question.trim();

    return (
      <div>
        <div className="relative w-full
            border-2 border-[#D0D5DD] dark:placeholder-[#fff] dark:bg-[#1A202C] dark:text-white rounded-lg pl-[50px] focus:outline-none focus:border-[#E04F16] focus:ring-0 focus:ring-[#E04F16]-100
      ">
          {/* File Input Field */}
          <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} />

          <button
            onClick={toggleDropdown}
            className={`bg-transparent absolute w-[31px] h-[31px] z-10 ${file ? 'top-[80px]' : 'top-[10px]'} left-[12px] circlePlusIcon`}
          >
            <img src={isDarkMode ? CirclePlus : CirclePlusWhite} alt="Microphone" />
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            placeholder={placeholder}
            value={question || liveRecognizedText}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue !== undefined) {
                onQuestionChange(e, newValue);
                setRecognizedText(newValue);
              }
            }}
            onKeyDown={onEnterPress}
            className="w-full h-[50px] border-2 border-[transparent] dark:placeholder-[#fff] dark:bg-[#1A202C] dark:text-white rounded-lg  pr-[5%] focus:outline-none focus:border-[transparent] focus:ring-0 focus:ring-[transparent]-100"
          />



          {/* Microphone icon */}
          <div
            onClick={isListening ? onStopClick : onMicrophoneClick}
            onKeyDown={(e) =>
              e.key === 'Enter' || e.key === ' ' ? (isListening ? onStopClick() : onMicrophoneClick()) : null
            }
            role="button"
            tabIndex={0}
            aria-label="Microphone button"
          >
            {microphoneIconActive ? (
              <img
                className={`absolute w-[31px] h-[31px] z-10 ${file ? 'top-[80px]' : 'top-[10px]'} right-[12px] microphoneIcon`}
                src={MicrophoneIconBlue}
                alt="Microphone"
              />
            ) : (
              <img
                className={`absolute w-[31px] h-[31px] z-10 ${file ? 'top-[80px]' : 'top-[10px]'} right-[12px] microphoneIcon`}
                src={MicrophoneIcon}
                alt="Microphone"
              />
            )}
          </div>

          {/* Send icon */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Ask question button"
            onClick={sendQuestion}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}
          >
            {disabled ? (
              <img
                className={`absolute w-[31px] h-[31px] z-10 ${file ? 'top-[80px]' : 'top-[10px]'} right-[-52px] sendBtnIcon`}
                src={isDarkMode ? SendBtn : SendBtnWhite}
                alt="Microphone"
              />
            ) : (
              <img
                className={`absolute w-[31px] h-[31px] z-10 ${file ? 'top-[80px]' : 'top-[10px]'} right-[-52px] sendBtnIcon`}
                src={isDarkMode ? SendBtn : SendBtnWhite}
                alt="Microphone"
              />
            )}
          </div>

          {/* worked on file  */}
          {file && (
            <div className="relative flex w-[95%] items-center justify-between p-2 px-4	mb-4 border border-gray-200 rounded-lg shadow-sm">
              {/* Close icon in the top-right corner */}
              <button
                onClick={() => setFile(undefined)} // This will clear the file, or any function that removes the file
                className="absolute top-[-10px] right-[-10px] bg-black text-white rounded-full p-1 
                hover:bg-gray-900 hover:text-gray-300 transition dark:bg-white
                 dark:text-gray-500 dark:hover:bg-gray-100 dark:hover:text-black"
                aria-label="Remove file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* File icon */}
              <div className="flex w-[85%] items-center space-x-3">
                <img
                  src={FileIcon}
                  className="h-[40px] w-[40px] rounded-lg"
                  aria-hidden="true"
                  alt="Logo from SuperCube"
                />

                {/* File name and size */}
                <div>
                  <p className="text-gray-900 font-medium text-base line-clamp-1 dark:text-white">{fileName}</p>
                  <div className="flex items-center">
                    <p className="text-gray-500 text-sm mr-2 dark:text-white">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <span className="text-gray-500 text-sm dark:text-white">- {uploadProgress}% uploaded</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center space-x-2 ">
                {uploadProgress < 100 && (
                  <svg
                    className="animate-spin h-9 w-9 text-orange-500 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-[#667085] text-center text-xs font-normal pt-2 pb-2">
          Please ensure to check generated information. SuperCube can make mistakes.
        </p>

      </div>

    );
  },
);
