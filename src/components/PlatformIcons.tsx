import React from 'react';

interface PlatformIconProps {
  platform: string;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, className = "w-5 h-5" }) => {
  const norm = platform.toLowerCase();

  if (norm.includes('youtube')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#FF0000" />
        <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="white" />
      </svg>
    );
  }

  if (norm.includes('facebook')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#1877F2" />
        <path d="M15.5 12.5H13.2V19H10.5V12.5H9V10.2H10.5V8.8C10.5 7.2 11.4 6 13.5 6H15.5V8.2H14.1C13.4 8.2 13.2 8.5 13.2 9.1V10.2H15.6L15.5 12.5Z" fill="white" />
      </svg>
    );
  }

  if (norm.includes('instagram')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
        <rect x="5.5" y="5.5" width="13" height="13" rx="4" stroke="white" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.6" />
        <circle cx="15.8" cy="8.2" r="0.9" fill="white" />
      </svg>
    );
  }

  if (norm.includes('tiktok')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#000000" />
        <path d="M14.8 6.5C15.4 7.4 16.3 8 17.5 8.1V10.2C16.4 10.2 15.4 9.8 14.7 9.1V14.3C14.7 16.6 12.8 18.5 10.5 18.5C8.2 18.5 6.3 16.6 6.3 14.3C6.3 12 8.2 10.1 10.5 10.1C10.9 10.1 11.3 10.2 11.7 10.3V12.5C11.3 12.3 10.9 12.2 10.5 12.2C9.4 12.2 8.4 13.1 8.4 14.3C8.4 15.4 9.4 16.4 10.5 16.4C11.7 16.4 12.6 15.4 12.6 14.3V6.5H14.8Z" fill="white" />
        <path d="M14.8 6.5C15.4 7.4 16.3 8 17.5 8.1V8.5C16.3 8.4 15.4 7.8 14.8 7V6.5Z" fill="#25F4EE" />
      </svg>
    );
  }

  if (norm.includes('telegram')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#2AABEE" />
        <path d="M6.5 11.7L16.8 7.3C17.3 7.1 17.7 7.4 17.6 7.9L15.8 16.4C15.7 16.9 15.3 17 14.9 16.8L12.4 15L11.2 16.1C11.1 16.2 11 16.4 10.8 16.4L11 13.5L16.2 8.8C16.4 8.6 16.2 8.5 15.9 8.7L9.5 12.7L6.7 11.8C6.1 11.6 6.1 11.2 6.8 10.9L6.5 11.7Z" fill="white" />
      </svg>
    );
  }

  if (norm.includes('spotify')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#1DB954" />
        <path d="M16.5 14.7C16.3 15 15.9 15.1 15.6 14.9C13.2 13.4 10.1 13.1 7.6 13.8C7.2 13.9 6.9 13.7 6.8 13.4C6.7 13 6.9 12.7 7.2 12.6C10.1 11.7 13.5 12.1 16.3 13.8C16.6 14 16.7 14.4 16.5 14.7ZM17.4 12.6C17.1 13 16.6 13.1 16.2 12.8C13.5 11.2 9.5 10.7 6.9 11.5C6.5 11.6 6 11.4 5.9 10.9C5.8 10.5 6 10 6.5 9.9C9.6 8.9 14.1 9.5 17.2 11.4C17.5 11.6 17.6 12.1 17.4 12.6ZM17.5 10.3C14.3 8.4 9.1 8.2 6.1 9.1C5.6 9.3 5.1 9 4.9 8.5C4.8 8 5.1 7.5 5.6 7.3C9.1 6.3 14.8 6.5 18.5 8.7C19 9 19.1 9.6 18.8 10.1C18.5 10.5 17.9 10.6 17.5 10.3Z" fill="white" />
      </svg>
    );
  }

  if (norm.includes('snapchat')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#FFFC00" />
        <path d="M12 6.5C10.2 6.5 8.8 7.8 8.8 9.5C8.8 10.1 8.9 10.8 9.1 11.4C8.7 11.6 8.2 11.8 7.7 12.1C7.5 12.2 7.5 12.4 7.6 12.5C7.9 12.7 8.3 12.6 8.8 12.5C8.7 13.1 8.6 13.7 8.1 14.2C7.7 14.6 7.2 14.7 6.8 14.9C6.6 15 6.6 15.3 6.9 15.4C7.5 15.6 8.3 15.5 8.9 15.1C9.3 15.7 10 16.3 11 16.4C11.3 16.4 11.6 16.2 12 16.2C12.4 16.2 12.7 16.4 13 16.4C14 16.3 14.7 15.7 15.1 15.1C15.7 15.5 16.5 15.6 17.1 15.4C17.4 15.3 17.4 15 17.2 14.9C16.8 14.7 16.3 14.6 15.9 14.2C15.4 13.7 15.3 13.1 15.2 12.5C15.7 12.6 16.1 12.7 16.4 12.5C16.5 12.4 16.5 12.2 16.3 12.1C15.8 11.8 15.3 11.6 14.9 11.4C15.1 10.8 15.2 10.1 15.2 9.5C15.2 7.8 13.8 6.5 12 6.5Z" fill="#111111" stroke="#111111" strokeWidth="0.4" />
      </svg>
    );
  }

  if (norm.includes('threads')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#000000" />
        <text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">@</text>
      </svg>
    );
  }

  if (norm.includes('twitter') || norm.includes(' x ') || norm === 'x') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#000000" />
        <path d="M16.5 6H18.2L14.4 10.3L18.8 16.5H15.3L12.5 12.8L9.4 16.5H7.7L11.8 11.8L7.6 6H11.2L13.7 9.4L16.5 6ZM15.9 15.5H16.8L10.5 7H9.5L15.9 15.5Z" fill="white" />
      </svg>
    );
  }

  if (norm.includes('linkedin')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#0077B5" />
        <path d="M8.2 10H6.2V17H8.2V10ZM7.2 9.1C7.8 9.1 8.3 8.6 8.3 8C8.3 7.4 7.8 6.9 7.2 6.9C6.6 6.9 6.1 7.4 6.1 8C6.1 8.6 6.6 9.1 7.2 9.1ZM17.8 17H15.8V13.8C15.8 13 15.5 12.4 14.7 12.4C14.1 12.4 13.7 12.8 13.5 13.2C13.4 13.4 13.4 13.6 13.4 13.9V17H11.4C11.4 17 11.4 10.7 11.4 10H13.4V11C13.7 10.5 14.3 9.8 15.5 9.8C16.8 9.8 17.8 10.7 17.8 12.6V17Z" fill="white" />
      </svg>
    );
  }

  if (norm.includes('twitch')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#9146FF" />
        <path d="M7 6H17V14L14 17H11.5L9.5 19V17H7V6ZM15.5 13V7.5H14.5V13H15.5ZM12.5 13V7.5H11.5V13H12.5Z" fill="white" />
      </svg>
    );
  }

  if (norm.includes('kick')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#53FC18" />
        <path d="M7 6H9.5V10.5L13.5 6H16.5L12 11.2L17 18H14L10.5 12.8V18H7V6Z" fill="#000000" />
      </svg>
    );
  }

  if (norm.includes('traffic') || norm.includes('website')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#FF5A1F" />
        <circle cx="12" cy="12" r="5.5" stroke="white" strokeWidth="1.5" />
        <path d="M6.5 12H17.5M12 6.5C13.5 8 14.2 10 14.2 12C14.2 14 13.5 16 12 17.5C10.5 16 9.8 14 9.8 12C9.8 10 10.5 8 12 6.5Z" stroke="white" strokeWidth="1.2" />
      </svg>
    );
  }

  if (norm.includes('whatsapp')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#25D366" />
        <path d="M12 6C8.7 6 6 8.7 6 12C6 13.1 6.3 14.1 6.8 15L6 18L9.1 17.2C10 17.7 11 18 12 18C15.3 18 18 15.3 18 12C18 8.7 15.3 6 12 6ZM15 14.4C14.9 14.7 14.4 15 14.1 15C13.9 15 13.6 15 12.5 14.5C11.1 13.9 10.2 12.5 10.1 12.4C10 12.3 9.3 11.4 9.3 10.4C9.3 9.4 9.8 8.9 10 8.7C10.2 8.5 10.4 8.5 10.6 8.5C10.7 8.5 10.8 8.5 10.9 8.5C11.1 8.5 11.2 8.4 11.3 8.7C11.5 9.1 11.9 10.1 11.9 10.2C12 10.3 12 10.4 11.9 10.6C11.8 10.7 11.7 10.8 11.6 10.9C11.5 11.1 11.4 11.2 11.5 11.4C11.6 11.6 12 12.2 12.6 12.7C13.3 13.3 13.9 13.5 14.1 13.6C14.3 13.7 14.4 13.7 14.5 13.5C14.7 13.3 15 12.9 15.2 12.6C15.3 12.4 15.5 12.4 15.7 12.5C15.9 12.6 16.9 13.1 17.1 13.2C17.3 13.3 17.4 13.4 17.4 13.5C17.4 13.7 17.4 14.2 15 14.4Z" fill="white" />
      </svg>
    );
  }

  // Default / Other
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#EA580C" />
      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
