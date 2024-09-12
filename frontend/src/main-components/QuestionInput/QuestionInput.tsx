import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Stack, TextField } from "@fluentui/react";
import { ITextFieldStyles } from "@fluentui/react";
import MicrophoneIcon from "../../assets/MicrophoneIcon.svg";
import CirclePlus from "../../assets/CirclePlus.svg";
import SendBtn from "../../assets/SendBtn.svg";
import styles from "./QuestionInput.module.css";


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

// Define customTextFieldStyles with the correct type
const customTextFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    width: '100%', // Ensures the TextField takes the full width of its container
  },
  fieldGroup: {
    height: 50, // Custom height
    width: '100%', // Full width
    borderRadius: 10, // Rounded corners
    overflow: 'hidden', // To ensure the rounded corners work properly
    border: '2px solid #D0D5DD', // Custom border
    paddingLeft: 50, // Padding on the left side
  },
  field: {
    height: '100%', // Ensures the input field takes the full height
    display: 'flex', // Flexbox for aligning the content
    alignItems: 'center', // Centering the text vertically
  },
};

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
    <Stack horizontal className={styles.questionInputContainer}>
      {/* File Input Field */}
      <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} />
      <img
        src={CirclePlus}
        className={styles.circlePlusIcon}
        alt="Microphone"
      />
      {/* Text Input Field */}
      <TextField
        styles={customTextFieldStyles}
        placeholder={placeholder}
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
      <img
        src={MicrophoneIcon}
        className={styles.microphoneIcon}
        alt="Microphone"
      />
      <img
        src={SendBtn}
        className={styles.sendBtnIcon}
        alt="Microphone"
      />
    </Stack>
  );
});
