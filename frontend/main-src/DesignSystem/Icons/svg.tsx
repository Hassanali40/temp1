import React from 'react';

export const SVG = {
  pencil: (
    <svg
      stroke="#000"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  ),
  add: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_17_17337)">
        <path
          d="M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z"
          fill="#323232"
        />
      </g>
      <defs>
        <clipPath id="clip0_17_17337">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  send: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.5004 12H5.00043M4.91577 12.2915L2.58085 19.2662C2.39742 19.8142 2.3057 20.0881 2.37152 20.2569C2.42868 20.4034 2.55144 20.5145 2.70292 20.5567C2.87736 20.6054 3.14083 20.4869 3.66776 20.2497L20.3792 12.7296C20.8936 12.4981 21.1507 12.3824 21.2302 12.2216C21.2993 12.082 21.2993 11.9181 21.2302 11.7784C21.1507 11.6177 20.8936 11.5019 20.3792 11.2705L3.66193 3.74776C3.13659 3.51135 2.87392 3.39315 2.69966 3.44164C2.54832 3.48375 2.42556 3.59454 2.36821 3.74078C2.30216 3.90917 2.3929 4.18255 2.57437 4.72931L4.91642 11.7856C4.94759 11.8795 4.96317 11.9264 4.96933 11.9744C4.97479 12.0171 4.97473 12.0602 4.96916 12.1028C4.96289 12.1508 4.94718 12.1977 4.91577 12.2915Z"
        stroke="#F59430"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  recordingGear: (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_2476_701)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.6303 0C58.9288 0 80 22.3062 80 48.5911C80 70.5288 54.4139 80 31.6303 80C13.8859 80 0 65.6766 0 48.5911C0 26.1958 8.37134 0 31.6303 0Z"
          fill="url(#paint0_linear_2476_701)"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2476_701"
          x="0"
          y="0"
          width="88"
          height="88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="4" dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2476_701" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2476_701" result="shape" />
        </filter>
        <linearGradient id="paint0_linear_2476_701" x1="0" y1="40" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59430" stopOpacity="0.86" />
          <stop offset="1" stopColor="#FEF4EA" />
        </linearGradient>
      </defs>
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_17_4653)">
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill="#323232"
        />
      </g>
      <defs>
        <clipPath id="clip0_17_4653">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  pause: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z"
        stroke="#AF8E4D"
        strokeWidth="2.5"
      />
      <path d="M21 22V9H17.0495V22H21ZM10 9V22H13.9505V9H10Z" fill="#AF8E4D" />
    </svg>
  ),
  mic: (
    <svg viewBox="-10 -70 550 650" fill="#af8e4d" height="26px" width="26px" xmlns="http://www.w3.org/2000/svg">
      <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z" />
      <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z" />
      <path
        d="M230,260 m330,0 a300,300 0 1,0 -600,0 a300,300 0 1,0 600,0"
        stroke="#af8e4d"
        fill="none"
        strokeWidth="35"
      />
    </svg>
  ),
  checkmark: (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_17_18089)">
        <path
          d="M9.00014 16.1699L5.53014 12.6999C5.14014 12.3099 4.51014 12.3099 4.12014 12.6999C3.73014 13.0899 3.73014 13.7199 4.12014 14.1099L8.30014 18.2899C8.69014 18.6799 9.32014 18.6799 9.71014 18.2899L20.2901 7.70995C20.6801 7.31995 20.6801 6.68995 20.2901 6.29995C19.9001 5.90995 19.2701 5.90995 18.8801 6.29995L9.00014 16.1699Z"
          fill="#323232"
        />
      </g>
      <defs>
        <clipPath id="clip0_17_18089">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  loading: (
    <svg width="56" height="13" viewBox="0 0 56 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.0388 6.61816C12.0388 9.7938 9.56192 12.3682 6.50648 12.3682C3.45104 12.3682 0.974121 9.7938 0.974121 6.61816C0.974121 3.44253 3.45104 0.868164 6.50648 0.868164C9.56192 0.868164 12.0388 3.44253 12.0388 6.61816Z"
        fill="#F59430"
      />
      <path
        d="M33.8367 6.61816C33.8367 9.7938 31.3598 12.3682 28.3043 12.3682C25.2489 12.3682 22.772 9.7938 22.772 6.61816C22.772 3.44253 25.2489 0.868164 28.3043 0.868164C31.3598 0.868164 33.8367 3.44253 33.8367 6.61816Z"
        fill="#EE413E"
      />
      <path
        d="M55.0257 6.61816C55.0257 9.7938 52.5487 12.3682 49.4933 12.3682C46.4379 12.3682 43.9609 9.7938 43.9609 6.61816C43.9609 3.44253 46.4379 0.868164 49.4933 0.868164C52.5487 0.868164 55.0257 3.44253 55.0257 6.61816Z"
        fill="#FDC130"
      />
    </svg>
  ),
  cancel: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_6_8846)">
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill="#323232"
        />
      </g>
      <defs>
        <clipPath id="clip0_6_8846">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  newPatient: (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.8334 8.83333V3.83333M13.3334 6.33333H18.3334M13.3334 18V17C13.3334 15.5999 13.3334 14.8998 13.0609 14.365C12.8212 13.8946 12.4387 13.5122 11.9683 13.2725C11.4336 13 10.7335 13 9.33335 13H5.66669C4.26656 13 3.56649 13 3.03171 13.2725C2.56131 13.5122 2.17885 13.8946 1.93917 14.365C1.66669 14.8998 1.66669 15.5999 1.66669 17V18M10.4167 6.75C10.4167 8.36083 9.11085 9.66667 7.50002 9.66667C5.88919 9.66667 4.58335 8.36083 4.58335 6.75C4.58335 5.13917 5.88919 3.83333 7.50002 3.83333C9.11085 3.83333 10.4167 5.13917 10.4167 6.75Z"
        stroke="white"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  transcription: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_6_16001)">
        <path
          d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4.58 16.59L4 17.17V4H20V16ZM6 12H8V14H6V12ZM6 9H8V11H6V9ZM6 6H8V8H6V6ZM10 12H15V14H10V12ZM10 9H18V11H10V9ZM10 6H18V8H10V6Z"
          fill="#323232"
        />
      </g>
      <defs>
        <clipPath id="clip0_6_16001">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  delete: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.3699 6.85602V6.05602C16.3699 4.93591 16.3699 4.37586 16.1519 3.94804C15.9601 3.57171 15.6542 3.26575 15.2779 3.07401C14.85 2.85602 14.29 2.85602 13.1699 2.85602H11.5699C10.4498 2.85602 9.88972 2.85602 9.46189 3.07401C9.08557 3.26575 8.77961 3.57171 8.58786 3.94804C8.36987 4.37586 8.36987 4.93591 8.36987 6.05602V6.85602M10.3699 12.356V17.356M14.3699 12.356V17.356M3.36987 6.85602H21.3699M19.3699 6.85602V18.056C19.3699 19.7362 19.3699 20.5763 19.0429 21.218C18.7553 21.7825 18.2963 22.2414 17.7318 22.529C17.0901 22.856 16.25 22.856 14.5699 22.856H10.1699C8.48972 22.856 7.64964 22.856 7.0079 22.529C6.44342 22.2414 5.98447 21.7825 5.69685 21.218C5.36987 20.5763 5.36987 19.7362 5.36987 18.056V6.85602"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  dots: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
