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
        <div className={`${styles.sideMenu} ${isOpen ? styles.open : ''}`}>

            <div>
                <div className={styles.HeaderContent}>
                    <div className={styles.HeaderContentCenter}>
                        <img src={SuperCubeLogo} className={styles.chatIcon} aria-hidden="true" />
                        <div className={styles.HeaderTextMain}>
                            <p className={styles.HeaderTextSuper}>super</p>
                            <p className={styles.HeaderTextCube}>cube</p>
                        </div>
                    </div>
                    <img src={ArrowSquare} className={styles.closeButton} onClick={closeMenu} aria-hidden="true" />
                </div>
                <div className={styles.menuContent}>
                    <div className={styles.newChatButton}>
                        <img src={EditBtn} className={styles.newChatEditIcon} onClick={closeMenu} aria-hidden="true" />
                        <button >New chat</button>
                    </div>
                    <div className={styles.todaySection}>
                        <p className={styles.sectionTitle}>Today</p>

                        <div className={styles.ChatButtonItem}>
                            <button >New chat</button>
                            <img src={DotsVertical} className={styles.ChatButtonItemIcon} onClick={closeMenu} aria-hidden="true" />
                        </div>

                    </div>
                </div>
            </div>

            <div className={styles.bottomContent}>
                <div className={styles.profileSection}>
                    <div className={styles.profileSectionImage}>
                        <img src="https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg" alt="Profile" className={styles.profileImage} />
                        <div>
                            <p className={styles.profileName}>Dr. John Drummond</p>
                            <p className={styles.profileSubtitle}>Bellevue Medical Centre</p>
                        </div>
                        <img src={isOpenProfile ? ChevronUp : ChevronDown} onClick={() => setIsOpenProfile(!isOpenProfile)} className={styles.downIcon} aria-hidden="true" />
                    </div>
                    {isOpenProfile &&
                        <div className={styles.profileOptions}>
                            <div className={styles.profileOptionsContent}>
                                <img src={ClockRewind} className={styles.profileOptionsIcon} onClick={closeMenu} aria-hidden="true" />
                                <p>History</p>
                            </div>
                            <div className={styles.profileOptionsContent}>
                                <img src={Settings} className={styles.profileOptionsIcon} onClick={closeMenu} aria-hidden="true" />
                                <p>Settings</p>
                            </div>
                            <div className={styles.profileOptionsContent}>
                                <img src={Lightning} className={styles.profileOptionsIcon} onClick={closeMenu} aria-hidden="true" />
                                <p>Admin Panel</p>
                            </div>
                            <div className={styles.profileOptionsContent}>
                                <img src={LogOut} className={styles.profileOptionsIcon} onClick={closeMenu} aria-hidden="true" />
                                <p>Logout</p>
                            </div>
                        </div>}
                </div>

                <div className={styles.themeSwitcher}>
                    <button
                        className={theme ? styles.activeLight : styles.darkThemeButton} // Apply 'active' style if true
                        onClick={() => setTheme(true)} // Set theme to light
                    >
                        Light
                        <img src={theme ? SunBlack : SunBlack} className={styles.buttonIcon} aria-hidden="true" />
                    </button>

                    <button
                        className={!theme ? styles.active : styles.darkThemeButton} // Apply 'active' style if false
                        onClick={() => setTheme(false)} // Set theme to dark
                    >
                        Dark
                        <img src={theme ? MoonBlack : MoonWhite} className={styles.buttonIconMoon} aria-hidden="true" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SideMenu;
