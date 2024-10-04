import { useEffect, useMemo, useState } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { FontIcon } from '@fluentui/react';

import { AskResponse, Citation } from '../../api';
import { parseAnswer } from './AnswerParser';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// eslint-disable-next-line import/no-unresolved
import supersub from 'remark-supersub';

interface Props {
  answer: AskResponse;
  onCitationClicked: (citedDocument: Citation) => void;
  index: number;
}

export const Answer = ({ answer, onCitationClicked, index }: Props) => {
  const [isRefAccordionOpen, { toggle: toggleIsRefAccordionOpen }] = useBoolean(false);
  const filePathTruncationLimit = 50;

  const messageBoxId = 'message-' + index;

  const parsedAnswer = useMemo(() => parseAnswer(answer), [answer]);
  const [chevronIsExpanded, setChevronIsExpanded] = useState(isRefAccordionOpen);

  const handleChevronClick = () => {
    setChevronIsExpanded(!chevronIsExpanded);
    toggleIsRefAccordionOpen();
  };

  useEffect(() => {
    setChevronIsExpanded(isRefAccordionOpen);
  }, [isRefAccordionOpen]);

  const createCitationFilepath = (citation: Citation, index: number, truncate: boolean = false) => {
    let citationFilename = '';

    if (citation.filepath && citation.chunk_id != null) {
      if (truncate && citation.filepath.length > filePathTruncationLimit) {
        const citationLength = citation.filepath.length;
        citationFilename = `${citation.filepath.substring(0, 20)}...${citation.filepath.substring(citationLength - 20)} - Part ${parseInt(citation.chunk_id) + 1}`;
      } else {
        citationFilename = `${citation.filepath} - Part ${parseInt(citation.chunk_id) + 1}`;
      }
    } else {
      citationFilename = `Citation ${index}`;
    }
    return citationFilename;
  };

  useEffect(() => {
    const handleCopy = () => {
      alert('Please consider where you paste this content.');
    };
    const messageBox = document.getElementById(messageBoxId);
    messageBox?.addEventListener('copy', handleCopy);
    return () => {
      messageBox?.removeEventListener('copy', handleCopy);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className="flex flex-col items-start p-2 bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.14),0px_0px_2px_rgba(0,0,0,0.12)] rounded-[5px] max-w-full"
        id={messageBoxId}
      >
        <div className="grow">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, supersub]}
            className="text-[14px] font-normal leading-[20px] text-[#323130] flex-none order-1 self-stretch flex-grow-0 m-3 whitespace-normal break-words max-w-[800px] overflow-x-auto"
          >
            {parsedAnswer.markdownFormatText}
          </ReactMarkdown>
        </div>

        <div className="flex flex-col w-full box-border">
          <div className="flex justify-center">
            <span className="text-[12px] font-normal leading-[16px] mr-2 ml-2 pb-1 flex items-center text-center text-[#707070] flex-none order-1 flex-grow-0">
              AI-generated content may be incorrect
            </span>
          </div>

          {!!parsedAnswer.citations.length && (
            <div aria-label="References">
              <div className="w-full">
                <div className="flex flex-row justify-start items-center">
                  <button onClick={toggleIsRefAccordionOpen} className="bg-transparent outline-none border-0">
                    <span className="mr-2 ml-2 text-[12px] font-normal leading-[16px] flex items-center text-[#616161]">
                      {parsedAnswer.citations.length > 1
                        ? parsedAnswer.citations.length + ' references'
                        : '1 reference'}
                    </span>
                  </button>
                  <FontIcon
                    className="flex flex-row justify-center items-center mt-1 text-[#616161] text-[10px]"
                    onClick={handleChevronClick}
                    iconName={chevronIsExpanded ? 'ChevronDown' : 'ChevronRight'}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {chevronIsExpanded && (
          <div className="mt-2 flex flex-col h-full gap-1 max-w-full">
            {parsedAnswer.citations.map((citation, idx) => {
              return (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                <span
                  title={createCitationFilepath(citation, ++idx)}
                  key={idx}
                  onClick={() => onCitationClicked(citation)}
                  className="ml-2 text-[12px] font-semibold leading-[16px] max-w-full text-[#115EA3] flex flex-row items-center p-[4px_6px] gap-1 border border-[#D1D1D1] rounded-[4px] hover:underline cursor-pointer"
                >
                  <div className="box-border flex flex-col justify-center items-center p-0 w-[14px] h-[14px] border border-[#E0E0E0] rounded-[4px] flex-none flex-grow-0 z-2 text-[10px] font-semibold leading-[14px] text-center text-[#424242] cursor-pointer hover:underline">
                    {idx}
                  </div>
                  {createCitationFilepath(citation, idx, true)}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
