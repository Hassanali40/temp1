import React, { useEffect, useState, memo, useRef } from 'react';
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
import { UserData } from '../../interfaces/user';
import { useGlobalStore } from '../../store';
import { formatUserName } from '../../util';

interface ProfileDropdownProps {
  isDarkMode: boolean;
}

// eslint-disable-next-line react/display-name
const UserInformationDropdown = memo(({ isDarkMode }: ProfileDropdownProps) => {
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [UserDetails, setUserDetails] = useState<UserData>();
  const getUser = useGlobalStore((state) => state.getUser);

  const isBeenRendered = useRef<boolean>(false);

  const closeMenu = () => {
    setIsOpenProfile(false);
  };

  useEffect(() => {
    if (!isBeenRendered.current) {
      getUser().then((res) => setUserDetails(res));
      isBeenRendered.current = true;
    }
  }, [getUser]);

  const profilePicture =
    'https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg';

  return (
    <div className="flex flex-col items-center p-2 bg-transparent rounded-lg border border-[#D0D5DD]">
      <div className="flex flex-row items-center gap-3 w-full">
        <img
          src={profilePicture}
          // src={UserDetails?.image}
          alt="Profile"
          className="w-[45px] h-[45px] rounded-full object-cover"
        />
        <div>
          <p className="m-0 text-[#344054] text-[14px] font-semibold leading-5 dark:text-white">
            {formatUserName(UserDetails?.name || 'friend')}
          </p>
          <p className="m-0 text-[#344054] text-[12px] font-normal leading-[18px] dark:text-white">
            {UserDetails?.bannerMessage}
          </p>
        </div>
        <button onClick={() => setIsOpenProfile(!isOpenProfile)} className="ml-auto">
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
});

export default UserInformationDropdown;
