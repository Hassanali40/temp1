import React from 'react';
import styles from './SideMenuSmall.module.css';
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
        <div className={styles.smallSideBarContainer}>
            <div className={styles.smallSideBarTopContent}>
                <div className={styles.smallSideBarTopIcons}>
                    <img src={SuperCubeLogo} className={styles.logoIcon} aria-hidden="true" />
                    <img onClick={toggleMenu} src={ArrowSquareRight} className={styles.openButton} aria-hidden="true" />
                </div>
                <div className={styles.editIconButton}>
                    <img src={EditWhiteIcon} className={styles.EditButton} aria-hidden="true" />
                </div>
            </div>
            <div className={styles.smallSideBarBottomContent}>
                <div className={styles.smallSideBarBottomImage}>
                    <img
                        src="https://www.shutterstock.com/image-photo/happy-black-man-mature-portrait-260nw-2281799533.jpg"
                        alt="Profile"
                        className={styles.profileImage}
                    />
                    <img src={ChevronDown} className={styles.downIcon} aria-hidden="true" />
                </div>
                <div className={styles.editIconButton}>
                    <img src={SunWhite} className={styles.EditButton} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
};

export default SmallSideBar;
