import * as React from "react";
import { SVGProps } from "react";

const LogoSVG = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <rect width="512" height="512" rx="92" fill="#1f2937" />
    <path
      d="M128 150h256M128 256h256M128 362h256"
      fill="none"
      stroke="#f8fafc"
      strokeWidth="34"
      strokeLinecap="round"
    />
    <rect x="112" y="115" width="96" height="70" rx="18" fill="#f8c14a" />
    <rect x="258" y="221" width="142" height="70" rx="18" fill="#14b8a6" />
    <rect x="112" y="327" width="142" height="70" rx="18" fill="#f8fafc" />
    <path
      d="M141 150h38M287 256h84M141 362h84"
      fill="none"
      stroke="#1f2937"
      strokeWidth="18"
      strokeLinecap="round"
    />
  </svg>
);

export default LogoSVG;
