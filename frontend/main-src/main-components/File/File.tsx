import React from 'react';
import { Button, Icon } from '../../DesignSystem';

interface IFile {
  name: string;
  clearFile?: () => void;
  sizeInMB?: string;
  fileExtension?: string;
}

const colors: { [key: string]: string } = {
  // Word documents - Google Docs blue
  doc: '#4285F4',
  docx: '#4285F4',

  // Excel spreadsheets - Google Sheets green
  xls: '#0F9D58',
  xlsx: '#0F9D58',
  csv: '#0F9D58',

  // PowerPoint presentations - Google Slides yellow
  ppt: '#FBBC05',
  pptx: '#FBBC05',

  // PDF files - Red
  pdf: '#EA4335',

  // Text files - Gray
  txt: '#9E9E9E',
  rtf: '#9E9E9E',

  // Image files - Gray
  jpg: '#9E9E9E',
  jpeg: '#9E9E9E',
  png: '#9E9E9E',
  gif: '#9E9E9E',
  bmp: '#9E9E9E',
  svg: '#9E9E9E',

  // Compressed files - Orange
  zip: '#FFA726',
  rar: '#FFA726',
  '7z': '#FFA726',

  // Audio files - Purple
  mp3: '#AB47BC',
  wav: '#AB47BC',
  flac: '#AB47BC',

  // Video files - Teal
  mp4: '#26A69A',
  avi: '#26A69A',
  mkv: '#26A69A',

  // Code files - Indigo
  js: '#3F51B5',
  ts: '#3F51B5',
  html: '#3F51B5',
  css: '#3F51B5',
  json: '#3F51B5',
};

const getFileIcon = (extension?: string) => (
  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 4C0 1.79086 1.79086 0 4 0H20L32 12V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z"
      fill={extension ? colors[extension] || '#0F9D58' : '#0F9D58'}
    />
    <path opacity="0.3" d="M20 0L32 12H24C21.7909 12 20 10.2091 20 8V0Z" fill="white" />
  </svg>
);

export default function File({ name, clearFile, sizeInMB, fileExtension }: IFile) {
  return (
    <div className="relative w-fit border rounded-2xl flex gap-x-5 items-center justify-between pl-4 pr-10 py-1 mx-3 mb-3">
      <div>
        {getFileIcon(fileExtension)}
        {fileExtension && (
          <span className="absolute px-0.5 rounded-sm w-fit h-3 text-sm grid place-content-center p-0 m-0 font-bold bg-white text-[#344054] top-6 left-2.5 cursor-default">
            {fileExtension}
          </span>
        )}
      </div>
      <div className="text-left flex flex-col">
        <span className="text-sm text-ellipsis text-accent-foreground line-clamp-1">{name}</span>
        {sizeInMB && <span className="text-sm text-muted-foreground dark:text-slate-400">{sizeInMB} MB</span>}
      </div>

      {typeof clearFile === 'function' && (
        <Button variant="ghost" onClick={clearFile} className="absolute right-0 top-0 pr-1.5 pb-2 hover:bg-transparent">
          <Icon name="close" />
        </Button>
      )}
    </div>
  );
}
