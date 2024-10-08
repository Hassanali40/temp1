import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Stack, TextField } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
import Send from "../../assets/Send.svg";
import MicrophoneIcon from "../../assets/mic-outline.svg";
import styles from "./QuestionInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

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
    <Stack>
      <Stack horizontal className={styles.questionInputContainer}>
        {/* File Input Field */}
        <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} />
        {/* Text Input Field */}
        <TextField
          className={styles.questionInputTextArea}
          placeholder={placeholder}
          multiline
          resizable={false}
          borderless
          value={question || liveRecognizedText}
          onChange={(e, newValue) => {
            if (newValue !== undefined) {
              onQuestionChange(e, newValue);
              setRecognizedText(newValue);
            }
          }}
          onKeyDown={onEnterPress}
        />
        <div className={styles.microphoneAndSendContainer}>
          {/* Microphone Icon */}
          <div
            className={styles.questionInputMicrophone}
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
              <FontAwesomeIcon
                icon={faMicrophone}
                className={styles.microphoneIconActive}
                style={{ color: "blue" }}
              />
            ) : (
              <img
                src={MicrophoneIcon}
                className={styles.microphoneIcon}
                alt="Microphone"
              />
            )}
          </div>

          {/* Send Button */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Ask question button"
            onClick={sendQuestion}
            onKeyDown={(e) =>
              e.key === "Enter" || e.key === " " ? sendQuestion() : null
            }
            className={styles.questionInputSendButtonContainer}
          >
            {disabled ? (
              <SendRegular className={styles.questionInputSendButtonDisabled} />
            ) : (
              <img
                src={Send}
                className={styles.questionInputSendButton}
                alt="Send"
              />
            )}
          </div>
        </div>
      </Stack>
      <Stack>
      </Stack>
    </Stack>
  );
});
