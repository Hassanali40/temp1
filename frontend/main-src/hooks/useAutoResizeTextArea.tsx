import { RefObject, useEffect } from 'react';

interface IautoResizeTextArea {
  textareaRef: RefObject<HTMLTextAreaElement>;
  text: string;
  maxHeight?: number;
  sessionId?: string;
  minHeight?: number;
}

const useAutoResizeTextArea = ({ textareaRef, text, maxHeight = 0, minHeight, sessionId }: IautoResizeTextArea) => {
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = minHeight ? `${minHeight}px` : 'auto';
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;

      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [text, textareaRef, maxHeight, sessionId, minHeight]);
};

export default useAutoResizeTextArea;
