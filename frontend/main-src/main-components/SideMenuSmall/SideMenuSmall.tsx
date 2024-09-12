import React from 'react';
import SuperCubeLogo from "../../assets/SuperCubeLogo.svg";
import EditWhiteIcon from "../../assets/EditWhiteIcon.svg";
import SunWhite from "../../assets/SunWhite.svg";
import ArrowSquareRight from "../../assets/ArrowSquareRight.svg";
import ChevronDown from "../../assets/ChevronDown.svg";

interface SmallSideBarProps {
    toggleMenu: () => void;
}

const SmallSideBar: React.FC<SmallSideBarProps> = ({ toggleMenu }) => {
    return (
        <div className="bg-[#FEF6EE] flex flex-col justify-between w-[110px] h-full pr-[15px]">
            <div className="w-full">
                <div className="flex flex-row justify-between items-center w-full">
                    <img src={SuperCubeLogo} className="h-[36px] w-[36px] rounded-lg" aria-hidden="true" />
                    <img onClick={toggleMenu} src={ArrowSquareRight} className="h-[29px] w-[29px]" aria-hidden="true" />
                </div>
                <div className="w-full mt-5 bg-[#E04F16] h-[39px] rounded-lg flex justify-center items-center cursor-pointer">
                    <img src={EditWhiteIcon} className="h-[28px] w-[28px]" aria-hidden="true" />
                </div>
            </div>

            <div className="w-full flex flex-col justify-center">
                <div className="flex justify-around items-center w-full h-[74px] border border-[#D0D5DD] rounded-lg">
                    <img
                        src="https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg"
                        alt="Profile"
                        className="w-[42px] h-[42px] rounded-full object-cover"
                    />
                    <img src={ChevronDown} className="w-[24px] h-[24px]" aria-hidden="true" />
                </div>
                <div className="w-full mt-5 bg-[#E04F16] h-[39px] rounded-lg flex justify-center items-center cursor-pointer">
                    <img src={SunWhite} className="h-[22px] w-[22px]" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
};

export default SmallSideBar;
