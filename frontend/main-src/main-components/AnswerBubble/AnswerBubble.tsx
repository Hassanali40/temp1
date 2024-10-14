import React, { useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';
import { QA } from '../../interfaces/session';
import supersub from 'remark-supersub';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface IIndexable {
  [key: string]: boolean;
}

interface IAnswerBubble {
  qa?: QA;
  isSelected?: boolean;
  isLoading: boolean;
}

type HtmlParsedAnswer = {
  answerHtml: string;
  citations: string[];
  followupQuestions: string[];
};

export function parseAnswerToHtml(answer: string): HtmlParsedAnswer {
  const citations: string[] = [];
  const followupQuestions: string[] = [];

  // Extract any follow-up questions that might be in the answer
  let parsedAnswer = answer.replace(/<<([^>>]+)>>/g, (match, content) => {
    followupQuestions.push(content);
    return '';
  });
  parsedAnswer = parsedAnswer.trim();
  const parts = parsedAnswer.split(/\[([^\]]+)\]/g);

  const fragments: string[] = parts.map((part, index) => {
    return index % 2 ? '' : part;
  });

  return {
    answerHtml: fragments.join(''),
    citations,
    followupQuestions,
  };
}

export default function AnswerBubble({ qa, isSelected, isLoading }: IAnswerBubble) {
  const answerContainerRef = useRef<HTMLDivElement>(null);

  const displayText = qa?.answer.answer;
  const parsedAnswer = useMemo(() => parseAnswerToHtml(displayText || ''), [displayText]);
  const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);

  const AnswerIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_159_1696)">
        <path
          d="M0 12.8C0 8.31958 0 6.07937 0.871948 4.36808C1.63893 2.86278 2.86278 1.63893 4.36808 0.871948C6.07937 0 8.31958 0 12.8 0H19.2C23.6804 0 25.9206 0 27.6319 0.871948C29.1372 1.63893 30.3611 2.86278 31.1281 4.36808C32 6.07937 32 8.31958 32 12.8V19.2C32 23.6804 32 25.9206 31.1281 27.6319C30.3611 29.1372 29.1372 30.3611 27.6319 31.1281C25.9206 32 23.6804 32 19.2 32H12.8C8.31958 32 6.07937 32 4.36808 31.1281C2.86278 30.3611 1.63893 29.1372 0.871948 27.6319C0 25.9206 0 23.6804 0 19.2V12.8Z"
          fill="white"
        />
        <path
          d="M0 12.8C0 8.31958 0 6.07937 0.871948 4.36808C1.63893 2.86278 2.86278 1.63893 4.36808 0.871948C6.07937 0 8.31958 0 12.8 0H19.2C23.6804 0 25.9206 0 27.6319 0.871948C29.1372 1.63893 30.3611 2.86278 31.1281 4.36808C32 6.07937 32 8.31958 32 12.8V19.2C32 23.6804 32 25.9206 31.1281 27.6319C30.3611 29.1372 29.1372 30.3611 27.6319 31.1281C25.9206 32 23.6804 32 19.2 32H12.8C8.31958 32 6.07937 32 4.36808 31.1281C2.86278 30.3611 1.63893 29.1372 0.871948 27.6319C0 25.9206 0 23.6804 0 19.2V12.8Z"
          fill="url(#paint0_linear_159_1696)"
        />
        <rect x="-0.269531" width="32" height="32" fill="#B93815" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.7843 2.43282C15.7843 2.43282 4.99487 7.79625 4.74124 7.87815C4.48761 7.96005 4.21289 8.45923 4.74129 8.79418C5.26968 9.12913 15.6828 14.0868 15.6828 14.0868C15.6828 14.0868 26.1466 8.81176 26.6244 8.53973C27.1022 8.26769 27.1829 8.006 26.6753 7.67458L15.7843 2.43282ZM15.7303 9.67845C17.9963 9.67845 19.8334 8.90259 19.8334 7.94551C19.8334 6.98844 17.9963 6.21257 15.7303 6.21257C13.4642 6.21257 11.6271 6.98844 11.6271 7.94551C11.6271 8.90259 13.4642 9.67845 15.7303 9.67845Z"
          fill="white"
        />
        <path
          d="M8.43621 16.1751C8.58301 15.925 8.96935 15.8823 9.18053 16.4557L11.4127 21.8861C11.913 23.2407 11.3204 23.1064 11.0344 22.9722L6.06782 20.5804C5.80481 20.4672 5.71047 20.0923 6.0103 19.7659L8.43621 16.1751Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 14.983L26.7819 9.4808C27.4729 9.10143 27.766 9.16245 27.7679 9.73523C27.7697 10.308 27.8633 22.2662 27.8633 22.2662L16.9544 27.8955C16.3873 28.1509 16.0308 28.2098 16.032 27.7365C16.0333 27.2632 16 14.983 16 14.983ZM20.5502 17.0266C20.371 17.1242 20.3079 17.2827 20.3079 17.44L20.4048 22.3579L24.6841 20.0201C24.8363 19.9331 24.8694 19.8068 24.8694 19.6495L24.8552 14.9739L20.5502 17.0266Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.9998 2.03884C8.28923 2.03884 2.03861 8.28946 2.03861 16C2.03861 23.7105 8.28923 29.9612 15.9998 29.9612C23.7103 29.9612 29.9609 23.7105 29.9609 16C29.9609 8.28946 23.7103 2.03884 15.9998 2.03884ZM1.96094 16C1.96094 8.24657 8.24634 1.96117 15.9998 1.96117C23.7532 1.96117 30.0386 8.24657 30.0386 16C30.0386 23.7534 23.7532 30.0388 15.9998 30.0388C8.24634 30.0388 1.96094 23.7534 1.96094 16Z"
          fill="#D0D5DD"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 12.0779C13.8338 12.0779 12.0777 13.834 12.0777 16.0002C12.0777 18.1665 13.8338 19.9226 16 19.9226C18.1662 19.9226 19.9223 18.1665 19.9223 16.0002C19.9223 13.834 18.1662 12.0779 16 12.0779ZM12 16.0002C12 13.7911 13.7909 12.0002 16 12.0002C18.2091 12.0002 20 13.7911 20 16.0002C20 18.2094 18.2091 20.0002 16 20.0002C13.7909 20.0002 12 18.2094 12 16.0002Z"
          fill="#D0D5DD"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.0004 13.3201C14.5205 13.3201 13.3208 14.5198 13.3208 15.9997C13.3208 17.4796 14.5205 18.6793 16.0004 18.6793C17.4804 18.6793 18.6801 17.4796 18.6801 15.9997C18.6801 14.5198 17.4804 13.3201 16.0004 13.3201ZM13.2432 15.9997C13.2432 14.4769 14.4776 13.2424 16.0004 13.2424C17.5233 13.2424 18.7577 14.4769 18.7577 15.9997C18.7577 17.5225 17.5233 18.757 16.0004 18.757C14.4776 18.757 13.2432 17.5225 13.2432 15.9997Z"
          fill="#D0D5DD"
        />
        <path d="M15.9609 0H16.0386V32H15.9609V0Z" fill="#D0D5DD" />
        <path d="M32 15.9609L32 16.0386L-3.39506e-09 16.0386L0 15.9609L32 15.9609Z" fill="#D0D5DD" />
        <path d="M26.6016 0H26.6792V32H26.6016V0Z" fill="#D0D5DD" />
        <path d="M10.6406 0H10.7183V32H10.6406V0Z" fill="#D0D5DD" />
        <path d="M21.2812 0H21.3589V32H21.2812V0Z" fill="#D0D5DD" />
        <path d="M5.32031 0H5.39798V32H5.32031V0Z" fill="#D0D5DD" />
        <path d="M32 26.6016L32 26.6792L-3.39506e-09 26.6792L0 26.6016L32 26.6016Z" fill="#D0D5DD" />
        <path d="M32 10.6406L32 10.7183L-3.39506e-09 10.7183L0 10.6406L32 10.6406Z" fill="#D0D5DD" />
        <path d="M32 21.2812L32 21.3589L-3.39506e-09 21.3589L0 21.2812L32 21.2812Z" fill="#D0D5DD" />
        <path d="M32 5.32031L32 5.39798L-3.39506e-09 5.39798L0 5.32031L32 5.32031Z" fill="#D0D5DD" />
      </g>
      <path
        d="M0.1 12.8C0.1 10.5581 0.100078 8.88276 0.208661 7.55376C0.31715 6.22593 0.533455 5.25268 0.961049 4.41348C1.71845 2.92699 2.92699 1.71845 4.41348 0.961049C5.25268 0.533455 6.22593 0.31715 7.55376 0.208661C8.88276 0.100078 10.5581 0.1 12.8 0.1H19.2C21.4419 0.1 23.1172 0.100078 24.4462 0.208661C25.7741 0.31715 26.7473 0.533455 27.5865 0.961049C29.073 1.71845 30.2816 2.92699 31.039 4.41348C31.4665 5.25268 31.6828 6.22593 31.7913 7.55376C31.8999 8.88276 31.9 10.5581 31.9 12.8V19.2C31.9 21.4419 31.8999 23.1172 31.7913 24.4462C31.6828 25.7741 31.4665 26.7473 31.039 27.5865C30.2816 29.073 29.073 30.2816 27.5865 31.039C26.7473 31.4665 25.7741 31.6828 24.4462 31.7913C23.1172 31.8999 21.4419 31.9 19.2 31.9H12.8C10.5581 31.9 8.88276 31.8999 7.55376 31.7913C6.22593 31.6828 5.25268 31.4665 4.41348 31.039C2.92699 30.2816 1.71845 29.073 0.961049 27.5865C0.533455 26.7473 0.31715 25.7741 0.208661 24.4462C0.100078 23.1172 0.1 21.4419 0.1 19.2V12.8Z"
        stroke="#D0D5DD"
        strokeWidth="0.2"
      />
      <defs>
        <linearGradient id="paint0_linear_159_1696" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#D0D5DD" />
        </linearGradient>
        <clipPath id="clip0_159_1696">
          <path
            d="M0 12.8C0 8.31958 0 6.07937 0.871948 4.36808C1.63893 2.86278 2.86278 1.63893 4.36808 0.871948C6.07937 0 8.31958 0 12.8 0H19.2C23.6804 0 25.9206 0 27.6319 0.871948C29.1372 1.63893 30.3611 2.86278 31.1281 4.36808C32 6.07937 32 8.31958 32 12.8V19.2C32 23.6804 32 25.9206 31.1281 27.6319C30.3611 29.1372 29.1372 30.3611 27.6319 31.1281C25.9206 32 23.6804 32 19.2 32H12.8C8.31958 32 6.07937 32 4.36808 31.1281C2.86278 30.3611 1.63893 29.1372 0.871948 27.6319C0 25.9206 0 23.6804 0 19.2V12.8Z"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col w-full box-border dark:bg-white dark:text-background rounded-md py-4 px-5 max-w-fit">
        <p className="text-sm font-semibold p-0 m-0 mb-4 whitespace-pre-line resize-y">Generating Answer ...</p>
        <div className="flex justify-center">
          <span className="text-[12px] font-normal leading-[16px] px-2 flex items-center text-center text-[#707070] flex-none order-1 flex-grow-0">
            AI-generated content may be incorrect
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={answerContainerRef}
      className={`rounded-lg flex gap-3 min-w-full ${isSelected ? 'outline outline-2 outline-[#7376E1]' : ''}`}
    >
      <div>{AnswerIcon()}</div>
      <div className="flex-grow mb-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, supersub]}
          className="text-sm leading-8 text-accent-foreground p-0 m-0 flex-none order-1 break-words"
        >
          {sanitizedAnswerHtml}
        </ReactMarkdown>
      </div>
    </div>
  );
}
