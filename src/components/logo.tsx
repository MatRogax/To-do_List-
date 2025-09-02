import React from "react";

interface TaskMasterLogoProps {
  width?: number | string;
  height?: number | string;
}

const TaskMasterLogo: React.FC<TaskMasterLogoProps> = ({
  width = 100,
  height = 100,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={width}
    height={height}
    viewBox="0 0 48 48"
  >
    <path
      fill="#185abd"
      d="M24.48,29.316l-9.505,9.505L1.588,25.434c-0.784-0.784-0.784-2.054,0-2.838l6.667-6.667 c0.784-0.784,2.054-0.784,2.838,0L24.48,29.316z"
    />
    <linearGradient
      id="5qKAcydctVb3hkGT27jhwa_HpPqCqynotVp_gr1"
      x1="14.572"
      x2="43.188"
      y1="38.199"
      y2="9.583"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#4191fd" />
      <stop offset="1" stopColor="#55acfd" />
    </linearGradient>
    <path
      fill="url(#5qKAcydctVb3hkGT27jhwa_HpPqCqynotVp_gr1)"
      d="M17.797,41.642l-6.667-6.667c-0.784-0.784-0.784-2.054,0-2.838L36.907,6.358  c0.784-0.784,2.054-0.784,2.838,0l6.667,6.667c0.784,0.784,0.784,2.054,0,2.838L20.634,41.642  C19.851,42.425,18.58,42.425,17.797,41.642z"
    />
  </svg>
);

export default TaskMasterLogo;
