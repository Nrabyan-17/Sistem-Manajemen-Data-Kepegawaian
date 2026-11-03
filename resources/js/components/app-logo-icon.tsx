import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Badge top clip / lanyard holder */}
            <path d="M10 2h4" />
            <path d="M12 2v2" />
            {/* ID Card outline */}
            <rect x="3" y="4" width="18" height="18" rx="3" />
            {/* Employee avatar head */}
            <circle cx="12" cy="10.5" r="3" />
            {/* Employee shoulders */}
            <path d="M7 18.5c0-2.5 2.2-4 5-4s5 1.5 5 4" />
        </svg>
    );
}
