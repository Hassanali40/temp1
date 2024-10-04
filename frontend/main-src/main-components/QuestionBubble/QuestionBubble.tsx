import React from 'react';
import { Question } from '../../interfaces/session';

interface IQuestionBubble {
  question: Question;
}

const AnswerIcon = () => (
  <img
    src="https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg"
    alt="Profile"
    className="w-[34px] h-[34px] rounded-full object-cover aspect-auto"
  />
);

export default function QuestionBubble({ question }: IQuestionBubble) {
  return (
    <div className="flex gap-3 min-w-full justify-center">
      <div className="h-fit">{AnswerIcon()}</div>
      <div
        className={`flex flex-grow align-center mb-5 min-w-max bg-clr-yellow-100 dark:bg-clr-blue-500 dark:border-gray-600 dark:border dark:text-white rounded-lg`}
      >
        <div className="p-5 pt-4 pb-4 m-0 bg-gold-light-95">
          <p>{question.text}</p>
        </div>
      </div>
    </div>
  );
}
