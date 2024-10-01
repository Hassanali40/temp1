import React from 'react';
import { SuperCubeLogo, EditWhiteIcon, SunWhite, ArrowSquareRight, ChevronDown } from '../../assets';

interface SmallSideBarProps {
  toggleMenu: () => void;
}

const SmallSideBar: React.FC<SmallSideBarProps> = ({ toggleMenu }) => {
  return (
    <div className="bg-[#FEF6EE] dark:bg-[#1A202C] flex flex-col justify-between w-[110px] h-full pr-[15px]">
      <div className="w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <img src={SuperCubeLogo} className="h-[36px] w-[36px] rounded-lg" aria-hidden="true" alt="super cube logo" />
          <button onClick={toggleMenu} className="inline-block bg-transparent cursor-pointer">
            <img
              src={ArrowSquareRight}
              className="h-[29px] w-[29px] cursor-pointer"
              aria-hidden="true"
              alt="toggle menu"
            />
          </button>
        </div>
        <div className="w-full mt-5 bg-[#E04F16] h-[39px] rounded-lg flex justify-center items-center cursor-pointer">
          <img src={EditWhiteIcon} className="h-[28px] w-[28px]" aria-hidden="true" alt="edit icon" />
        </div>
      </div>

      <div className="w-full flex flex-col justify-center">
        <div className="flex justify-around items-center w-full h-[74px] border border-[#D0D5DD] rounded-lg">
          <img
            src="https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg"
            alt="Profile"
            className="w-[42px] h-[42px] rounded-full object-cover"
          />
          <img src={ChevronDown} className="w-[24px] h-[24px]" aria-hidden="true" alt="open menu" />
        </div>
        <div className="w-full mt-5 bg-[#E04F16] h-[39px] rounded-lg flex justify-center items-center cursor-pointer">
          <img src={SunWhite} className="h-[22px] w-[22px]" aria-hidden="true" alt="light mode icon" />
        </div>
      </div>
    </div>
  );
};

export default SmallSideBar;
