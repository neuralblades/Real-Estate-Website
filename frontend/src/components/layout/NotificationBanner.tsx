'use client';

import React, { useState } from 'react';

interface NotificationBannerProps {
  message?: string;
  buttonText?: string;
  buttonLink?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message = 'Experience luxury living at its finest on our newly launched website.',
  buttonText = 'EXPLORE NOW',
  buttonLink = '/',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#ccb047] text-gray-900 py-3 px-4 flex items-center justify-center relative">
      <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        <p className="font-medium">{message}</p>
        <a
          href={buttonLink}
          className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-1.5 text-sm font-medium hover:from-gray-900 hover:to-black transition-colors uppercase tracking-wider"
        >
          {buttonText}
        </a>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-gray-700"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default NotificationBanner;
