import React from 'react';

interface TopBarProps {
  onMenuClick: () => void;
  userName?: string;
  userRole?: string;
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  userName = 'User',
  userRole = 'User',
}) => (
  <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shrink-0 shadow-sm shadow-gray-100/50">
    {/* Mobile menu toggle */}
    <button
      onClick={onMenuClick}
      className="lg:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
      aria-label="Open menu"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    {/* Right: user info */}
    <div className="ml-auto flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-bold text-gray-900 leading-none">{userName}</p>
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">{userRole}</p>
      </div>
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-sm font-black shadow-md shadow-blue-200 ring-2 ring-white">
        {getInitials(userName)}
      </div>
    </div>
  </header>
);