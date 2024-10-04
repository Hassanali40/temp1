/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { Input } from '../../components/ui/input';

interface IInputCustom {
  value: string;
  onInput?: (e: React.FormEvent<HTMLInputElement>, value: string) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>, value: string) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>, value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  isFocused?: boolean;
}

export default function InputCustom({
  value,
  onInput,
  onBlur,
  onChange,
  name,
  id,
  className,
  type,
  isFocused,
  onKeyDown,
}: IInputCustom) {
  const handleOnInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onInput === 'function') {
      onInput(e, e.target.value);
    }
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onBlur === 'function') {
      onBlur(e, e.target.value);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange === 'function') {
      onChange(e, e.target.value);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof onKeyDown === 'function') {
      onKeyDown(e);
    }
  };

  return (
    <Input
      onKeyDown={handleOnKeyDown}
      autoFocus={isFocused}
      type={type}
      id={id}
      name={name}
      value={value}
      onInput={handleOnInput}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      className={className}
    />
  );
}
