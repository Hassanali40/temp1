/* eslint-disable jsx-a11y/no-autofocus */
import React, { ChangeEvent, useRef } from 'react';
import styles from './TextArea.module.css';
import { useAutoResizeTextArea } from '../../hooks';

interface ITextArea {
  value: string;
  onInput?: (e: string) => void;
  onChange?: (evt: React.ChangeEvent<HTMLTextAreaElement>, value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
  isDisabled?: boolean;
  placeHolder?: string;
  autoFocus?: boolean;
  minHeight?: number;
  id?: string;
}

export default function TextArea({
  id = '',
  value,
  onInput,
  isDisabled,
  onChange,
  placeHolder,
  onKeyDown,
  autoFocus,
  ...handlers
}: ITextArea) {
  const textAreaRef = useRef(null);

  useAutoResizeTextArea({
    textareaRef: textAreaRef,
    text: value,
    maxHeight: 300,
    minHeight: 50,
  });

  const handleOnInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (typeof onInput !== 'function') return;

    onInput(e.target.value);
  };

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (typeof onChange !== 'function') return;

    onChange(e, e.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (typeof onKeyDown !== 'function') return;

    onKeyDown(e);
  };

  return (
    <textarea
      id={`text-area-${id}`}
      autoFocus={autoFocus}
      placeholder={placeHolder}
      value={value}
      suppressContentEditableWarning
      onInput={handleOnInput}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      ref={textAreaRef}
      className={styles.textAreaComponent}
      disabled={isDisabled}
      {...handlers}
    />
  );
}
