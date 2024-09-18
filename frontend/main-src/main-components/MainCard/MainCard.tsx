import * as React from 'react';

// Define the props interface
interface MainCardProps {
    text: string;
    imgSrc: string;
}

export const MainCard: React.FunctionComponent<MainCardProps> = ({ text, imgSrc }) => {
    return (
        <div className="w-52 h-48 flex flex-col justify-between p-4 rounded-md shadow-md bg-[#F9FAFB] dark:bg-[#495368]">
            <p className="text-base font-normal text-gray-800 dark:text-white">
                {text}
            </p>
            <img src={imgSrc} className="h-10 w-10 ml-auto" aria-hidden="true" />
        </div>
    );
};