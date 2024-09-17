import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import MicrophoneIcon from "../../assets/MicrophoneIcon.svg";
import MicrophoneIconBlue from "../../assets/MicrophoneIconBlue.svg";
import SendBtn from "../../assets/SendBtn.svg";


interface Props {
  onSend: (question: string, file?: File) => void;
  onMicrophoneClick: () => void;
  onStopClick: () => void;
  disabled: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
  recognizedText: string;
  isListening: boolean;
  isRecognizing: boolean;
  setRecognizedText: (text: string) => void;
}

export const QuestionInput = forwardRef<{ triggerClick: () => void, clearFileInput: () => void }, Props>(({
  onSend,
  onMicrophoneClick,
  onStopClick,
  disabled,
  placeholder,
  clearOnSend,
  recognizedText,
  isListening,
  isRecognizing,
  setRecognizedText,
}, ref) => {
  const [question, setQuestion] = useState<string>("");
  const [liveRecognizedText, setLiveRecognizedText] = useState<string>("");
  const [microphoneIconActive, setMicrophoneIconActive] =
    useState<boolean>(false);
  const [file, setFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setQuestion("");
      setLiveRecognizedText("");
      setRecognizedText(""); // Clear recognizedText
      // setFile(undefined)
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !event.target.files) {
      return;
    }
    setFile(event.target.files[0])
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      sendQuestion();
    }
  };

  const onQuestionChange = (
    _ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setQuestion(newValue || "");
    setLiveRecognizedText(newValue || ""); // Update liveRecognizedText when edited
  };


  useImperativeHandle(ref, () => ({
    triggerClick: () => {
      fileInputRef.current?.click();
    },
    clearFileInput: () => {
      setFile(undefined)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }));

  const sendQuestionDisabled = disabled || !question.trim();



  return (
    <div className="relative w-full">
      {/* File Input Field */}
      <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} />

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
        className="w-full h-[50px] border-2 border-[#D0D5DD] rounded-lg pl-[50px] focus:outline-none focus:border-[#E04F16] focus:ring-0 focus:ring-[#E04F16]-100"
      />

      <div
        onClick={isListening ? onStopClick : onMicrophoneClick}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " "
            ? isListening
              ? onStopClick()
              : onMicrophoneClick()
            : null
        }
        role="button"
        tabIndex={0}
        aria-label="Microphone button"
      >
        {microphoneIconActive ? (
          <img
            className="absolute w-[31px] h-[31px] z-10 top-[10px] right-[12px] microphoneIcon"
            src={MicrophoneIconBlue}
            alt="Microphone"
          />
        ) : (
          <img
            className="absolute w-[31px] h-[31px] z-10 top-[10px] right-[12px] microphoneIcon"
            src={MicrophoneIcon}
            alt="Microphone"
          />
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Ask question button"
        onClick={sendQuestion}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? sendQuestion() : null
        }
      >
        {disabled ? (
          <img
            className="absolute w-[31px] h-[31px] z-10 top-[10px] right-[-52px] sendBtnIcon"
            src={SendBtn}
            alt="Microphone"
          />
        ) : (
          <img
            className="absolute w-[31px] h-[31px] z-10 top-[10px] right-[-52px] sendBtnIcon"
            src={SendBtn}
            alt="Microphone"
          />
        )}

      </div>
    </div>
  );
});
