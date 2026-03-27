import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // optional handler so parent pages can swap content without navigating
  onSelect?: (section: 'organizations' | 'admin') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();


  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm shadow-lg shadow-blue-900/50">
              S
            </div>
            <span className="text-lg font-black tracking-tight">SAM.gov</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {/* <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-3">Navigation</p> */}
          <NavItem
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            label="Organizations"
            isActive={location.pathname.startsWith('/organizations')}
            onClick={() => {
              if (onSelect) return onSelect('organizations');
              navigate('/organizations');
            }}
          />
          {user?.is_admin && (
          <NavItem
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l2 4 4 .5-3 2 1 4-4-2-4 2 1-4-3-2 4-.5L12 2z" />
              </svg>
            }
            label="Admin Dashboard"
            isActive={location.pathname === '/dashboard'}
            onClick={() => {
              if (onSelect) return onSelect('admin');
              navigate('/dashboard');
            }}
          />
            )}


        </nav>

        {/* Footer */}
        {/* <div className="shrink-0 p-3 border-t border-slate-800">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div> */}
      </aside>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left
      ${isActive
        ? 'bg-blue-600/15 text-blue-400 border border-blue-600/25'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }
    `}
  >
    {icon}
    {label}
  </button>
);