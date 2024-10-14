import React from 'react';
import {
    SuperCubeLogo,
    EditWhiteIcon,
} from '../../assets';

export default function MobileHeader() {

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
                >
                    <img src={EditWhiteIcon} className="h-[22px] w-[22px]" aria-hidden="true" alt="New patient pencil icon" />
                </button>
            </div>
        </>
    );
}
