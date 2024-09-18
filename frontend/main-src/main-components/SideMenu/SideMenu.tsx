import React, { useContext, useEffect, useState } from 'react';
import SuperCubeLogo from "../../assets/SuperCubeLogo.svg";
import ArrowSquare from "../../assets/ArrowSquare.svg";
import ArrowSquareWhite from "../../assets/ArrowSquareWhite.svg";
import EditBtn from "../../assets/EditBtn.svg";
import DotsVertical from "../../assets/DotsVertical.svg";
import ClockRewind from "../../assets/ClockRewind.svg";
import Settings from "../../assets/Settings.svg";
import Lightning from "../../assets/Lightning.svg";
import LogOut from "../../assets/LogOut.svg";
import ClockRewindWhite from "../../assets/ClockRewindWhite.svg";
import SettingsWhite from "../../assets/SettingsWhite.svg";
import LightningWhite from "../../assets/LightningWhite.svg";
import LogOutWhite from "../../assets/LogOutWhite.svg";
import ChevronDown from "../../assets/ChevronDown.svg";
import ChevronUp from "../../assets/ChevronUp.svg";
import SunWhite from "../../assets/SunWhite.svg";
import SunBlack from "../../assets/SunBlack.svg";
import MoonBlack from "../../assets/MoonBlack.svg";
import MoonWhite from "../../assets/MoonWhite.svg";
import { AppContext } from '../../store/context/AppContext';

interface SideMenuProps {
    isOpen: boolean;
    closeMenu: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, closeMenu }) => {

    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useContext must be used within an AppContext.Provider");
    }

    const { isDarkMode, setIsDarkMode } = context;

    const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);

    useEffect(() => {
        if (isDarkMode) {
            // Light mode
            document.documentElement.classList.remove('dark');
        } else {
            // Dark mode
            document.documentElement.classList.add('dark');
        }
    }, [isDarkMode]);

    return (

        <div className={`bg-[#FEF6EE] dark:bg-[#1A202C] flex flex-col justify-between w-[285px] h-full pr-[15px] ${isOpen ? 'left-0' : ''}`}>
            <div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                        <img src={SuperCubeLogo} className="h-[36px] w-[36px] rounded-lg" aria-hidden="true" />
                        <div className="flex flex-row items-center">
                            <p className="m-0 p-0 text-[#E04F16] text-[26px] font-extrabold">super</p>
                            <p className="m-0 p-0 text-[#F3943D] text-[26px] font-extrabold">cube</p>
                        </div>
                    </div>
                    <img src={isDarkMode ? ArrowSquare : ArrowSquareWhite} className="h-[28px] w-[28px] cursor-pointer" onClick={closeMenu} aria-hidden="true" />
                </div>

                <div className="mt-5">
                    <div className="flex justify-center items-center gap-2 bg-[#D85836] text-white h-[39px] rounded-lg mb-5 cursor-pointer">
                        <img src={EditBtn} className="h-[22px] w-[22px]" onClick={closeMenu} aria-hidden="true" />
                        <button className="bg-transparent text-white font-semibold text-[16px]">New chat</button>
                    </div>

                    <div className="mb-5">
                        <p className="text-[#475467] text-[14px] font-bold mb-2 dark:text-white">Today</p>
                        <div className="flex justify-between items-center gap-2 bg-[#D85836] text-white h-[36px] px-3 rounded mb-5 cursor-pointer">
                            <button className="bg-transparent text-white text-[16px]">New chat</button>
                            <img src={DotsVertical} className="h-[23px] w-[23px]" onClick={closeMenu} aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div className="flex flex-col items-center mt-5 p-2 bg-transparent rounded-lg border border-[#D0D5DD]">
                    <div className="flex flex-row items-center gap-3 w-full">
                        <img src="https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg" alt="Profile" className="w-[45px] h-[45px] rounded-full object-cover" />
                        <div>
                            <p className="m-0 text-[#344054] text-[14px] font-semibold leading-5 dark:text-white">Dr. John Drummond</p>
                            <p className="m-0 text-[#344054] text-[12px] font-normal leading-[18px] dark:text-white">Bellevue Medical Centre</p>
                        </div>
                        <img src={isOpenProfile ? ChevronUp : ChevronDown} onClick={() => setIsOpenProfile(!isOpenProfile)} className="h-[24px] w-[24px] ml-auto cursor-pointer" aria-hidden="true" />
                    </div>

                    {isOpenProfile && (
                        <div className="w-full mt-3">
                            <div className="flex items-center gap-3 mt-2">
                                <img src={isDarkMode ? ClockRewind : ClockRewindWhite} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <p className="m-0 text-[#344054] text-[14px] dark:text-white">History</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <img src={isDarkMode ? Settings : SettingsWhite} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <p className="m-0 text-[#344054] text-[14px] dark:text-white">Settings</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <img src={isDarkMode ? Lightning : LightningWhite} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <a href="/admin"><p className="m-0 text-[#344054] text-[14px] dark:text-white">Admin Panel</p></a>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <img src={isDarkMode ? LogOut : LogOutWhite} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <p className="m-0 text-[#344054] text-[14px] dark:text-white">Logout</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-5 px-1 py-1 rounded-md bg-[#fdc6a4] dark:bg-[#521e27]">
                    <button className={"flex items-center justify-center flex-1 rounded-md py-2 px-2 bg-[#fff] font-semibold	dark:bg-[#521e27] dark:text-white"} onClick={() => setIsDarkMode(true)}>
                        Light
                        <img src={isDarkMode ? SunBlack : SunWhite} className="h-[24px] w-[24px] ml-1" aria-hidden="true" />
                    </button>
                    <button className={"flex items-center justify-center flex-1 rounded-md py-2 px-2 font-semibold dark:bg-[#495368] dark:text-white"} onClick={() => setIsDarkMode(false)}>
                        Dark
                        <img src={isDarkMode ? MoonBlack : MoonWhite} className="h-[20px] w-[20px] ml-1" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
