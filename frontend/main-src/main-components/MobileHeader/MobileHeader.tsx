import React, { useContext, useState } from 'react';
import { AppContextTheme } from '../../store/context/AppContext';
import UserInformationDropdown from '../UserInformationDropdown/UserInformationDropdown';
import { Alert, Icon, MenuDropDown, Input } from '../../DesignSystem';
import { Pencil, Trash } from 'lucide-react';
import {
    SuperCubeLogo,
    EditWhiteIcon,
} from '../../assets';
import { useAlertDropDown, useSessions } from '../../hooks';

import styles from './MobileHeader.module.css';

interface SideMenuProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

export default function MobileHeader({ isOpen, toggleMenu }: SideMenuProps) {
    const { createNewSession, sessions, activeSession, setActiveSession, deleteSession, updateSession } = useSessions();
    const { dialogProps, setAlertData, isOpenDialog } = useAlertDropDown();
    const [enableEditMode, setEnableEditMode] = useState<{ sessionIdToEdit: string; edition: string } | null>(null);
    const context = useContext(AppContextTheme);

    console.log(sessions);

    if (!context) {
        throw new Error('useContext must be used within an AppContextTheme.Provider');
    }

    return (
        <>

            <div className="flex justify-between items-center pb-4">
                <img
                    src={SuperCubeLogo}
                    className="h-[36px] w-[36px] rounded-lg"
                    aria-hidden="true"
                    alt="Logo from SuperCube"
                />
                <div className="flex flex-row items-center">
                    <p className="m-0 p-0 text-[#E04F16] text-[26px] font-extrabold">super</p>
                    <p className="m-0 p-0 text-[#F3943D] text-[26px] font-extrabold">cube</p>
                </div>
                <button
                    className="text-white cursor-pointer font-semibold "
                    onClick={createNewSession}
                >
                    <img src={EditWhiteIcon} className="h-[22px] w-[22px]" aria-hidden="true" alt="New patient pencil icon" />
                </button>
            </div>
            {isOpenDialog && <Alert {...dialogProps} />}
        </>
    );
}
