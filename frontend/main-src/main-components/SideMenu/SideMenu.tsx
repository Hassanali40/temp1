import React, { useContext, useState } from 'react';
import { AppContextTheme } from '../../store/context/AppContext';
import UserInformationDropdown from '../UserInformationDropdown/UserInformationDropdown';
import { Alert, Icon, MenuDropDown, Input } from '../../DesignSystem';
import { Pencil, Trash } from 'lucide-react';
import {
  SuperCubeLogo,
  ArrowSquare,
  ArrowSquareWhite,
  EditBtn,
  SunWhite,
  SunBlack,
  MoonBlack,
  MoonWhite,
  ArrowSquareRight,
  EditWhiteIcon,
} from '../../assets';
import { useAlertDropDown, useSessions } from '../../hooks';

import styles from './SideMenu.module.css';

interface SideMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function SideMenu({ isOpen, toggleMenu }: SideMenuProps) {
  const { createNewSession, sessions, activeSession, setActiveSession, deleteSession, updateSession } = useSessions();
  const { dialogProps, setAlertData, isOpenDialog } = useAlertDropDown();
  const [enableEditMode, setEnableEditMode] = useState<{ sessionIdToEdit: string; edition: string } | null>(null);
  const context = useContext(AppContextTheme);

  if (!context) {
    throw new Error('useContext must be used within an AppContextTheme.Provider');
  }

  const { isDarkMode, setIsDarkMode } = context;

  const handleDeleteSession = (sessionId: string, name: string) => {
    setAlertData({
      title: 'Are you absolutely sure?',
      description: `This action cannot be undone. This will permanently delete the session "${name}" ...`,
      onClose: () => setAlertData(null),
      onContinue: async () => await deleteSession(sessionId),
    });
  };

  const handleRenameSession = (sessionId: string, name: string) => {
    setEnableEditMode({ sessionIdToEdit: sessionId, edition: name });
  };

  const onSaveLabel = async (sessionId: string) => {
    setEnableEditMode(null);
    await updateSession(sessionId, { name: enableEditMode?.edition });
  };

  const onEditLabelKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, sessionId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      setEnableEditMode(null);
      await updateSession(sessionId, { name: enableEditMode?.edition });
    }
  };

  return (
    <>
      <div
        className={`bg-[#FEF6EE] dark:bg-[#1A202C] flex flex-col ${isOpen ? 'w-[285px]' : 'w-[140px]'} max-h-[100dvh] pr-[15px] ${isOpen ? 'left-0' : ''}`}
      >
        <div>
          <div className="flex flex-row justify-between items-center">
            {isOpen ? (
              <>
                <div className="flex flex-row items-center gap-2">
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
                </div>
                <button
                  onClick={toggleMenu}
                  className="inline-block bg-transparent cursor-pointer"
                  data-testid="minimize-sidebar"
                >
                  <img
                    src={isDarkMode ? ArrowSquare : ArrowSquareWhite}
                    className="h-[28px] w-[28px] cursor-pointer"
                    aria-hidden="true"
                    alt="Icon from button to minimize sidebar"
                  />
                </button>
              </>
            ) : (
              <>
                <img
                  src={SuperCubeLogo}
                  className="h-[36px] w-[36px] rounded-lg"
                  aria-hidden="true"
                  alt="super cube logo"
                />
                <button onClick={toggleMenu} className="inline-block bg-transparent cursor-pointer">
                  <img
                    src={ArrowSquareRight}
                    className="h-[29px] w-[29px] cursor-pointer"
                    aria-hidden="true"
                    alt="toggle menu"
                  />
                </button>
              </>
            )}
          </div>
          {isOpen ? (
            <button
              className="mt-5 mb-8 flex justify-center items-center gap-2 bg-[#D85836] text-white h-9 rounded-lg cursor-pointer font-semibold text-[16px] min-w-full"
              onClick={createNewSession}
            >
              <img src={EditBtn} className="h-[22px] w-[22px]" aria-hidden="true" alt="New patient pencil icon" />
              New chat
            </button>
          ) : (
            <button
              className="mt-5 mb-8 flex justify-center items-center gap-2 bg-[#D85836] text-white h-9 rounded-lg cursor-pointer font-semibold text-[16px] min-w-full"
              onClick={createNewSession}
            >
              <img src={EditWhiteIcon} className="h-[22px] w-[22px]" aria-hidden="true" alt="New patient pencil icon" />
            </button>
          )}
        </div>

        <ul className="flex flex-col gap-2 pr-1 flex-auto overflow-auto overflow-x-hidden">
          {sessions.map(({ name, id }) =>
            isOpen ? (
              enableEditMode?.sessionIdToEdit === id ? (
                <Input
                  key={id}
                  value={enableEditMode.edition}
                  isFocused
                  onChange={(_e, value) => {
                    setEnableEditMode((prev) => ({ ...prev, sessionIdToEdit: id, edition: value }));
                  }}
                  onKeyDown={(e) => onEditLabelKeyDown(e, id)}
                  onBlur={() => onSaveLabel(id)}
                />
              ) : (
                <div
                  key={id}
                  onClick={() => setActiveSession(id)}
                  className={`min-w-full flex justify-between items-center gap-2 outline-none px-1 py-1 rounded cursor-pointer ${activeSession?.id === id && 'bg-primary text-white'} dark:text-white`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                >
                  {name}
                  <MenuDropDown
                    options={[
                      {
                        label: (
                          <>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </>
                        ),
                        action: () => handleRenameSession(id, name),
                      },
                      {
                        label: (
                          <>
                            <Trash className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-red-500">Delete</span>
                          </>
                        ),
                        action: () => handleDeleteSession(id, name),
                      },
                    ]}
                    renderTrigger={() => (
                      <span
                        aria-label="Open Session Menu Options"
                        className={`${isDarkMode && activeSession?.id !== id && styles.item}`}
                        role="button"
                        tabIndex={0}
                      >
                        <Icon name="dots" />
                      </span>
                    )}
                  />
                </div>
              )
            ) : (
              <div
                key={id}
                onClick={() => setActiveSession(id)}
                className={`outline-none mr-2 rounded py-1 cursor-pointer ${activeSession?.id === id && 'bg-primary text-white'} dark:text-white whitespace-nowrap text-ellipsis`}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
              >
                {name}
              </div>
            ),
          )}
        </ul>

        <div className="mt-3">
          <UserInformationDropdown isDarkMode={isDarkMode} />

          <div className="flex justify-between px-1 py-1 rounded-md bg-[#fdc6a4] dark:bg-[#521e27]">
            <button
              className={
                'flex items-center justify-center flex-1 rounded-md py-2 px-2 bg-[#fff] font-semibold	dark:bg-[#521e27] dark:text-white'
              }
              onClick={() => setIsDarkMode(true)}
            >
              Light
              <img
                src={isDarkMode ? SunBlack : SunWhite}
                className="h-[24px] w-[24px] ml-1"
                aria-hidden="true"
                alt="ligt mode icon"
              />
            </button>
            <button
              className={
                'flex items-center justify-center flex-1 rounded-md py-2 px-2 font-semibold dark:bg-[#495368] dark:text-white'
              }
              onClick={() => setIsDarkMode(false)}
            >
              Dark
              <img
                src={isDarkMode ? MoonBlack : MoonWhite}
                className="h-[20px] w-[20px] ml-1"
                aria-hidden="true"
                alt="dark mode icon"
              />
            </button>
          </div>
        </div>
      </div>

      {isOpenDialog && <Alert {...dialogProps} />}
    </>
  );
}
