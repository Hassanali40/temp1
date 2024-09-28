import React, { useContext, useEffect, useState } from 'react';
import { AppContextTheme } from '../../store/context/AppContext';
import UserInformationDropdown from "../UserInformationDropdown/UserInformationDropdown"

import {
    SuperCubeLogo,
    ArrowSquare,
    ArrowSquareWhite,
    EditBtn,
    DotsVertical,
    SunWhite,
    SunBlack,
    MoonBlack,
    MoonWhite
} from "../../assets";

interface SideMenuProps {
    isOpen: boolean;
    closeMenu: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, closeMenu }) => {

    const context = useContext(AppContextTheme);
    const isDarkModeOn = false; // or true, depending on the mode

    if (!context) {
        throw new Error("useContext must be used within an AppContextTheme.Provider");
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
                    <div className="flex justify-center items-center gap-2 bg-[#D85836] text-white h-[39px] rounded-lg mb-8 cursor-pointer">
                        <img src={EditBtn} className="h-[22px] w-[22px]" onClick={closeMenu} aria-hidden="true" />
                        <button className="bg-transparent text-white font-semibold text-[16px]">New chat</button>
                    </div>

                    <div className="mb-5">
                        <p className="text-[#475467] text-[14px] font-bold mb-4 dark:text-white">Today</p>
                        <div className="flex justify-between items-center gap-2 bg-[#D85836] text-white h-[36px] px-3 rounded mb-5 cursor-pointer">
                            <button className="bg-transparent text-white text-[16px]">New chat</button>
                            <button onClick={closeMenu} aria-label="Close menu">
                                <img src={DotsVertical} className="h-[23px] w-[23px]" alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <UserInformationDropdown isDarkMode={isDarkModeOn} />

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
