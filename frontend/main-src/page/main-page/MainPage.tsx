import { useRef, useState, useContext } from 'react';
import { QuestionInput } from '../../main-components/QuestionInput';
import { ChatView } from '../../main-components/Chat';
import SideMenu from '../../main-components/SideMenu/SideMenu';
import { AppContextTheme } from '../../store/context/AppContext';
import MobileHeader from '../../main-components/MobileHeader/MobileHeader';

export default function ChatWrapper() {
  const context = useContext(AppContextTheme);

  if (!context) {
    throw new Error('useContext must be used within an AppContextTheme.Provider');
  }

  const [isOpenOption, setIsOpenOption] = useState(false);
  const questionFileInputRef = useRef<{
    triggerClick: () => void;
    clearFileInput: () => void;
  } | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsOpenOption(!isOpenOption);
  };

  return (
    <>
      <div className="md:hidden">
        <MobileHeader isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
      <div className="md:flex w-full h-full bg-[#FEF6EE] dark:bg-[#1A202C] px-4 py-5">

        {/* Side Menu - Visible only on medium and larger screens */}
        <div className="hidden md:block">
          <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
        <div className="flex flex-1 w-full min-h-full bg-[#fff] dark:bg-[#334054] dark:border dark:border-white rounded-lg overflow-auto flex-col">
          <div className="flex flex-1 w-full h-full bg-[#fff] dark:bg-[#334054] overflow-auto flex-col">
            <div className="flex flex-1 flex-col h-full bg-[#fff] dark:bg-[#344054]">
              <ChatView />
            </div>
          </div>
          <div className="w-full pb-5 flex flex-col justify-center items-center ">
            <div className="w-full h-auto relative">
              <QuestionInput toggleDropDown={toggleDropdown} ref={questionFileInputRef} />
            </div>
            <p className="text-[#667085] text-center text-xs font-normal mt-2 px-2">
              Please ensure to check generated information. SuperCube can make mistakes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
