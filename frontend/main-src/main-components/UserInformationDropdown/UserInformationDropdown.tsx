import React, { useEffect, useState } from 'react';
import {
    ClockRewind,
    Settings,
    Lightning,
    LogOut,
    ClockRewindWhite,
    SettingsWhite,
    LightningWhite,
    LogOutWhite,
    ChevronDown,
    ChevronUp,
} from '../../assets';
import useUserData from '../../hooks/useUserData';
import { UserData } from '../../interfaces/user';
interface ProfileDropdownProps {
    isDarkMode: boolean;
}

const UserInformationDropdown: React.FC<ProfileDropdownProps> = ({ isDarkMode }) => {
    const [isOpenProfile, setIsOpenProfile] = useState(false);
    const [UserDetails, setUserDetails] = useState<UserData>();
    const { getUserData } = useUserData();

    const closeMenu = () => {
        setIsOpenProfile(false);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getUserData();
                if (response) {
                    setUserDetails(response);
                }
            } catch (error) {
                console.log(error, 'something went wrong')
            }
        };
        loadData();
    }, [getUserData]);

    return (
        <div className="flex flex-col items-center mt-5 p-2 bg-transparent rounded-lg border border-[#D0D5DD]">
            <div className="flex flex-row items-center gap-3 w-full">
                <img
                    src="https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg"
                    // src={UserDetails?.image}
                    alt="Profile"
                    className="w-[45px] h-[45px] rounded-full object-cover"
                />
                <div>
                    <p className="m-0 text-[#344054] text-[14px] font-semibold leading-5 dark:text-white">{UserDetails?.name}</p>
                    <p className="m-0 text-[#344054] text-[12px] font-normal leading-[18px] dark:text-white">
                        {UserDetails?.bannerMessage}
                    </p>
                </div>
                <button onClick={() => setIsOpenProfile(!isOpenProfile)}>
                    <img
                        src={isOpenProfile ? ChevronUp : ChevronDown}
                        className="h-[24px] w-[24px] ml-auto cursor-pointer"
                        aria-hidden="true"
                        alt="openprofile"
                    />
                </button>
            </div>

            {isOpenProfile && (
                <div className="w-full mt-3">
                    <div className="flex items-center gap-3 mt-2">
                        <button onClick={closeMenu}>
                            <img
                                src={isDarkMode ? ClockRewind : ClockRewindWhite}
                                className="h-[24px] w-[24px]"
                                aria-hidden="true"
                                alt="clonemenu"
                            />
                        </button>
                        <p className="m-0 text-[#344054] text-[14px] dark:text-white">History</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <button onClick={closeMenu}>
                            <img
                                src={isDarkMode ? Settings : SettingsWhite}
                                className="h-[24px] w-[24px]"
                                aria-hidden="true"
                                alt="history"
                            />
                        </button>
                        <p className="m-0 text-[#344054] text-[14px] dark:text-white">Settings</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">

                        <button onClick={closeMenu}>
                            <img
                                src={isDarkMode ? Lightning : LightningWhite}
                                className="h-[24px] w-[24px]"
                                aria-hidden="true"
                                alt="setting"
                            />
                        </button>
                        <a href="/admin">
                            <p className="m-0 text-[#344054] text-[14px] dark:text-white">Admin Panel</p>
                        </a>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <button onClick={closeMenu}>
                            <img
                                src={isDarkMode ? LogOut : LogOutWhite}
                                className="h-[24px] w-[24px]"
                                aria-hidden="true"
                                alt="admin"
                            />
                        </button>
                        <p className="m-0 text-[#344054] text-[14px] dark:text-white">Logout</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInformationDropdown;
