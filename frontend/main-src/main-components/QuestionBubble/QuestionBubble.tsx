import React, { useEffect, useState } from 'react';
import { Question } from '../../interfaces/session';
import File from '../File';
import { useGlobalStore } from '../../store';

interface IQuestionBubble {
  question: Question;
}

const profilePicture = 'https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg';

const AnswerIcon = (_userName: string) => (
  <img src={profilePicture} alt="Profile" className="w-[34px] h-[34px] rounded-full object-cover aspect-auto" />
);

export default function QuestionBubble({ question }: IQuestionBubble) {
  const { userData } = useGlobalStore();
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    const questionText = question.text.split('<file_attachments>');
    const hasInputAttached = questionText.length > 1;
    if (!hasInputAttached) return;

    const fileMetaData = JSON.parse(questionText[1].replaceAll('</file_attachments>', ''))[0];
    const fileName = fileMetaData?.file_attachment_metadata?.file_name;
    const text = questionText[0].split('</')[0].replaceAll('<user_prompt>', '');

    if (text && fileName) {
      setUploadedFileName(fileName || null);
      question.text = text;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.text]);

  return (
    <div className="flex gap-3 min-w-full justify-center">
      <div className="h-fit">{AnswerIcon(userData.user)}</div>
      <div
        className={`flex flex-grow align-center flex-wrap mb-5 mt-1 w-full dark:bg-clr-blue-500 dark:border-gray-600 dark:border dark:text-white rounded-lg`}
      >
        <div className="p-5 pt-4 pb-4 m-0 bg-gold-light-95">
          <p>{question.text}</p>
          {uploadedFileName && (
            <div className="mt-5">
              <File name={uploadedFileName} fileExtension={uploadedFileName.split('.')[1]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
