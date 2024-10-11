import React, { useState, useRef, useImperativeHandle, forwardRef, useContext } from 'react';
import { AppContextTheme } from '../../store/context/AppContext';
import File from '../File';
import { Button, Icon, MenuDropDown, TextArea } from '../../DesignSystem';
import { useSubmitQuestion } from '../../hooks';
import useSession from '../../hooks/useSession';
import { Session } from '../../interfaces/session';
import { useGlobalStore } from '../../store';
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';
import { SpeechService } from '../../services';
import { FileUploadIcon } from '../../assets';

const speechService = new SpeechService();

interface IQuestionInputProps {
  toggleDropDown: () => void;
}

const getSpeechLanguage = (language: string): string => {
  const speechMap: { [key: string]: string } = {
    en: 'en-US',
    es: 'es-US',
    ru: 'ru-RU',
    pt: 'pt-PT',
    ja: 'ja-JP',
    it: 'it-IT',
    de: 'de-DE',
    fr: 'fr-FR',
    nl: 'nl-NL',
    zh: 'zh-CN',
    vi: 'vi-VN',
  };
  return speechMap[language] ?? 'en-US';
};

// eslint-disable-next-line react/display-name
export const QuestionInput = forwardRef<
  {
    triggerClick: () => void;
  },
  IQuestionInputProps
>(({ toggleDropDown }, ref) => {
  const context = useContext(AppContextTheme);
  const { submitQuestion } = useSubmitQuestion();
  const { createNewSession, activeSession } = useSession();
  if (!context) {
    throw new Error('useContext must be used within an AppContextTheme.Provider');
  }
  const { isDarkMode } = context;
  const [question, setQuestion] = useState<string>('');
  const [completedText, setCompletedText] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [recognizer, setRecognizer] = useState<speechSdk.SpeechRecognizer>();
  const [micLoading, setMicLoading] = useState<boolean>(false);
  const [wakelock, setWakelock] = useState<WakeLockSentinel | undefined>();
  const [isDroppedEnabled, setIsDroppedEnabled] = useState(false);

  const isSendQuestionDisabled = !question.trim();

  const setupCognitiveServices = async (): Promise<speechSdk.SpeechRecognizer | undefined> => {
    const resp = await speechService.getSpeechToken();
    if (!resp) return;

    const { token, region } = resp;

    if (token) {
      const endSilenceTimeoutMs = 3500;
      const speechConfig = speechSdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = getSpeechLanguage('');
      speechConfig.enableDictation();
      speechConfig.setProfanity(speechSdk.ProfanityOption.Raw);
      speechConfig.setProperty(
        speechSdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
        endSilenceTimeoutMs.toString(),
      );

      const audioConfig = speechSdk.AudioConfig.fromDefaultMicrophoneInput();
      const recog = new speechSdk.SpeechRecognizer(speechConfig, audioConfig);
      const conn = speechSdk.Connection.fromRecognizer(recog);
      // Workaround for JS SDK bug
      // https://stackoverflow.com/questions/73322254/how-to-change-azure-text-to-speech-silence-timeout-in-javascript
      conn.setMessageProperty('speech.context', 'phraseDetection', {
        INTERACTIVE: {
          segmentation: {
            mode: 'custom',
            segmentationSilenceTimeoutMs: endSilenceTimeoutMs,
          },
        },
        mode: 'Interactive',
      });
      setRecognizer(recog);
      return recog;
    }
    return recognizer;
  };

  if (recognizer) {
    recognizer.recognizing = (_, recognitionEventArgs) => {
      const result = recognitionEventArgs.result;
      const recognizingText = result.text;
      setQuestion(completedText + recognizingText + '...');
    };

    // The 'recognized' event signals that a finalized recognition result has been received
    recognizer.recognized = (_, recognitionEventArgs) => {
      const result = recognitionEventArgs.result;
      // console.log(`(recognized)  Reason: ${speechSdk.ResultReason[result.reason]}`);
      switch (result.reason) {
        case speechSdk.ResultReason.NoMatch:
          speechSdk.NoMatchDetails.fromResult(result);
          // console.log(`NoMatchReason: ${speechSdk.NoMatchReason[noMatchDetail.reason]}\r\n`);
          break;
        case speechSdk.ResultReason.Canceled:
          speechSdk.CancellationDetails.fromResult(result);
          // console.log(`CancellationReason: ${speechSdk.CancellationReason[cancelDetails.reason]}`);
          // console.log(cancelDetails.reason === speechSdk.CancellationReason.Error ? `: ${cancelDetails.errorDetails}` : ``)\
          break;
        case speechSdk.ResultReason.RecognizedSpeech:
          if (result.text && result.text.length > 0) {
            const text = result.text;
            const newText = completedText.trimEnd() + ' ' + text.trim();
            setCompletedText(newText);
            setQuestion(newText);
          }
          break;
      }
    };

    //The 'canceled' event signals that the service has stopped processing speech.
    recognizer.canceled = (_, cancellationEventArgs) => {
      window.console.log('(cancel) Reason: ' + speechSdk.CancellationReason[cancellationEventArgs.reason]);
      if (cancellationEventArgs.reason === speechSdk.CancellationReason.Error) {
        console.error(cancellationEventArgs.errorDetails);
      }
    };

    // The 'sessionStarted' event signals that audio has begun flowing and an interaction with the service has
    // started.
    recognizer.sessionStarted = (_, _sessionEventArgs) => {
      setCompletedText(question);
      // console.log(`(sessionStarted) SessionId: ${sessionEventArgs.sessionId}`);
    };

    // The 'sessionStopped' event signals that the current interaction with the speech service has ended and
    // audio has stopped flowing.
    recognizer.sessionStopped = (_, _sessionEventArgs) => {
      // console.log(`(sessionStopped) SessionId: ${sessionEventArgs.sessionId}`);
    };
  }

  const sendQuestion = async () => {
    if (isSendQuestionDisabled) {
      return;
    }

    if (activeSession == null) {
      await createNewSession();
    }

    setQuestion('');
    setFile(null);
    await submitQuestion(
      {
        ...useGlobalStore.getState().activeSession,
        inputText: question,
      } as Session,
      file,
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    setFile(event.target.files[0]);

    event.target.value = '';
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      sendQuestion();
    }
  };

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (!newValue || newValue === '') {
      setQuestion('');

      return;
    }
    setQuestion(newValue);
  };

  useImperativeHandle(ref, () => ({
    triggerClick: () => {
      fileInputRef.current?.click();
    },
  }));

  const clearFile = () => {
    setFile(null);
  };

  const keepScreenOn = () => {
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((sentinel: WakeLockSentinel) => setWakelock(sentinel));
    }
  };

  const handleMsCognitiveService = async () => {
    if (micLoading) return;

    if (isListening) {
      setIsListening(false);
      recognizer?.stopContinuousRecognitionAsync();
      await wakelock?.release().then(() => {
        setWakelock(undefined);
      });
    } else {
      keepScreenOn();
      setMicLoading(true);
      await setupCognitiveServices()
        .then((recog) => {
          if (recog) {
            recog.startContinuousRecognitionAsync();
            setIsListening(true);
          }
        })
        .catch(() => {
          setIsListening(false);
        })
        .finally(() => {
          setMicLoading(false);
        });
    }
  };

  const handleOnDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    setIsDroppedEnabled(true);
    ev.preventDefault();

    const file = ev.dataTransfer.files[0];

    if (!file) return;

    setFile(file);
    setIsDroppedEnabled(false);
    /*
    ----------> Logic to accept multiple files

   if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file?.name}`);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    } */
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDroppedEnabled(true);
  };

  const handleDragEnd = () => {
    setIsDroppedEnabled(false);
  };

  return (
    <div
      className="flex w-full sm:px-5 pl-2 sm:gap-x-6 gap-x-2 items-end"
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragEnd}
    >
      {/* File Input Field */}
      <div
        className={`flex-1 flex items-end border rounded-xl px-3 bg-background ${isDroppedEnabled && 'border-dashed border-2'}`}
      >
        <MenuDropDown
          options={[
            {
              label: (
                <>
                  <img src={FileUploadIcon} className="h-5 w-5 mr-3" alt="Upload File" />
                  Upload file
                </>
              ),
              action: () => fileInputRef.current?.click(),
            },
          ]}
          renderTrigger={() =>
            !isDroppedEnabled && (
              <Button variant="ghost" onClick={toggleDropDown} className="p-0 pb-3">
                <Icon name={`${!isDarkMode ? 'circlePlusDark' : 'circlePlusWhite'}`} />
              </Button>
            )
          }
        />

        <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} />

        <div className="w-full flex flex-col">
          <TextArea
            placeHolder={isDroppedEnabled ? 'Drop file here' : 'Ask any question'}
            value={question}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={(e) => onQuestionChange(e, e.target.value)}
            onKeyDown={onEnterPress}
          />

          {file && (
            <File
              name={file.name}
              sizeInMB={`${file.size / 100}`}
              clearFile={clearFile}
              fileExtension={file.name.split('.')[1]}
            />
          )}
        </div>

        {!isDroppedEnabled && (
          <Button
            isLoading={micLoading}
            variant="ghost"
            aria-label="Recording button"
            onClick={handleMsCognitiveService}
            className="p-0 pb-3"
          >
            {isListening ? <Icon name="pause" /> : <Icon name="mic" />}
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        aria-label="Ask question button"
        onClick={sendQuestion}
        disabled={isSendQuestionDisabled}
        className="p-0 pb-5 "
      >
        <Icon name={`${isDarkMode ? 'sendDark' : 'sendLight'}`} />
      </Button>
    </div>
  );
});
