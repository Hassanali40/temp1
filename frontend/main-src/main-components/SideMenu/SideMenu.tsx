import React, { useState } from 'react';
import styles from './SideMenu.module.css';
import SuperCubeLogo from "../../assets/SuperCubeLogo.svg";
import ArrowSquare from "../../assets/ArrowSquare.svg";
import EditBtn from "../../assets/EditBtn.svg";
import DotsVertical from "../../assets/DotsVertical.svg";
import ClockRewind from "../../assets/ClockRewind.svg";
import Settings from "../../assets/Settings.svg";
import Lightning from "../../assets/Lightning.svg";
import LogOut from "../../assets/LogOut.svg";
import ChevronDown from "../../assets/ChevronDown.svg";
import ChevronUp from "../../assets/ChevronUp.svg";
import SunWhite from "../../assets/SunWhite.svg";
import SunBlack from "../../assets/SunBlack.svg";
import MoonBlack from "../../assets/MoonBlack.svg";
import MoonWhite from "../../assets/MoonWhite.svg";

interface SideMenuProps {
    isOpen: boolean;
    closeMenu: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, closeMenu }) => {

    const [isOpenProfile, setIsOpenProfile] =
        useState<boolean>(false);

    const [theme, setTheme] = useState<boolean>(false);

    return (

        <div className={`bg-[#FEF6EE] flex flex-col justify-between w-[285px] h-full pr-[15px] ${isOpen ? 'left-0' : ''}`}>
            <div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                        <img src={SuperCubeLogo} className="h-[36px] w-[36px] rounded-lg" aria-hidden="true" />
                        <div className="flex flex-row items-center">
                            <p className="m-0 p-0 text-[#E04F16] text-[26px] font-extrabold">super</p>
                            <p className="m-0 p-0 text-[#F3943D] text-[26px] font-extrabold">cube</p>
                        </div>
                    </div>
                    <img src={ArrowSquare} className="h-[28px] w-[28px]" onClick={closeMenu} aria-hidden="true" />
                </div>

                <div className="mt-5">
                    <div className="flex justify-center items-center gap-2 bg-[#D85836] text-white h-[39px] rounded-lg mb-5 cursor-pointer">
                        <img src={EditBtn} className="h-[22px] w-[22px]" onClick={closeMenu} aria-hidden="true" />
                        <button className="bg-transparent text-white font-semibold text-[16px]">New chat</button>
                    </div>

                    <div className="mb-5">
                        <p className="text-[#475467] text-[14px] font-bold mb-2">Today</p>
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
                            <p className="m-0 text-[#344054] text-[14px] font-semibold leading-5">Dr. John Drummond</p>
                            <p className="m-0 text-[#344054] text-[12px] font-normal leading-[18px]">Bellevue Medical Centre</p>
                        </div>
                        <img src={isOpenProfile ? ChevronUp : ChevronDown} onClick={() => setIsOpenProfile(!isOpenProfile)} className="h-[24px] w-[24px] ml-auto" aria-hidden="true" />
                    </div>

                    {isOpenProfile && (
                        <div className="w-full mt-3">
                            <div className="flex items-center gap-3 mt-2">
                                <img src={ClockRewind} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <p className="m-0 text-[#344054] text-[14px]">History</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <img src={Settings} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <p className="m-0 text-[#344054] text-[14px]">Settings</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <img src={Lightning} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <p className="m-0 text-[#344054] text-[14px]">Admin Panel</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <img src={LogOut} className="h-[24px] w-[24px]" onClick={closeMenu} aria-hidden="true" />
                                <p className="m-0 text-[#344054] text-[14px]">Logout</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-5 px-1 py-1 rounded-md bg-[#fdc6a4]">
                    <button className={`${theme ? 'bg-white text-[#333]' : 'bg-[#F4E7DE] text-[#333]'} flex items-center justify-center flex-1 rounded-md py-2 px-2`} onClick={() => setTheme(true)}>
                        Light
                        <img src={theme ? SunBlack : SunBlack} className="h-[24px] w-[24px] ml-1" aria-hidden="true" />
                    </button>
                    <button className={`${!theme ? 'bg-[#333] text-white' : 'bg-[#fdc6a4] text-[#333]'} flex items-center justify-center flex-1 rounded-md py-2 px-2`} onClick={() => setTheme(false)}>
                        Dark
                        <img src={theme ? MoonBlack : MoonWhite} className="h-[20px] w-[20px] ml-1" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
