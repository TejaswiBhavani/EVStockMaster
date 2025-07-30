import React from 'react';

const InvenAILogo = ({ size = 40, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f2027"/>
            <stop offset="50%" stopColor="#203a43"/>
            <stop offset="100%" stopColor="#2c5364"/>
          </linearGradient>
          <linearGradient id="elementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe"/>
            <stop offset="100%" stopColor="#4facfe"/>
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="32" height="32" fill="url(#bgGradient)" rx="6" />

        {/* AI Head */}
        <circle cx="16" cy="11" r="5" fill="url(#elementGradient)" />

        {/* Torso */}
        <path d="M13 16 L11 22 L13.5 22 L12 25 H20 L18.5 22 L21 22 L19 16 Z" fill="url(#elementGradient)" />

        {/* Lightning Bolt */}
        <path d="M16 17 L13 21 H15 L12 26 H17 L15 22 H18 Z" fill="#00f2fe" />

        {/* Circuit lines */}
        <path d="M13 13 Q16 11.5 19 13" stroke="#ffffff" strokeWidth="0.4" fill="none" />
        <path d="M14 15 Q16 14 18 15" stroke="#ffffff" strokeWidth="0.4" fill="none" />

        {/* Inventory grid hint */}
        <line x1="9" y1="23" x2="13" y2="23" stroke="#ffffff" strokeWidth="0.5" />
        <line x1="19" y1="23" x2="23" y2="23" stroke="#ffffff" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

export default InvenAILogo;