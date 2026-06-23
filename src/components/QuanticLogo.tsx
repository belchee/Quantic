import React from 'react';

export default function QuanticLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 72"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{"@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap');"}</style>
      </defs>
      <text
        x="0"
        y="52"
        fontFamily="'Rajdhani', sans-serif"
        fontWeight="700"
        fontSize="52"
        fill="white"
        letterSpacing="3"
      >
        QUANTIC
      </text>
      <path
        d="M 4 58 Q 30 72 56 58"
        stroke="white"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M195 18 C188 18 185 12 185 8 C185 3 190 0 195 0 C200 0 205 3 205 8 C205 12 202 18 195 18Z"
        fill="#e02020"
      />
    </svg>
  );
}
