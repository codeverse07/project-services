import { Home, Search, Calendar, User, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const MobileBottomNav = ({ className }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' }, // Updated to /search based on new page
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: User, label: 'Account', path: '/profile' },
  ];

  return (
    <div className={`fixed bottom-6 left-6 right-6 backdrop-blur-xl border border-white/40 dark:border-white/10 px-6 py-3 shadow-2xl shadow-rose-900/10 dark:shadow-black/40 rounded-full z-50 flex justify-between items-center md:hidden transition-all hover:scale-[1.01] ${className || 'bg-white/50 supports-[backdrop-filter]:bg-white/40 dark:bg-slate-900/60'}`}>
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`relative flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-xl group ${isActive ? '-translate-y-1' : ''}`}
          >
            {isActive && (
              <span className="absolute -top-1 w-1 h-1 bg-rose-500 rounded-full animate-bounce"></span>
            )}
            <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-100 dark:shadow-none' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-800'}`}>
              <item.icon className={`w-5 h-5 ${isActive ? 'fill-rose-600 dark:fill-rose-500/0' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
            </div>
          </Link>
        );
      })}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="relative flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-xl group active:scale-95"
      >
        <div className="p-2 rounded-full transition-all duration-300 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50">
          {theme === 'light' ? (
            <Moon className="w-5 h-5 fill-current" />
          ) : (
            <Sun className="w-5 h-5 fill-current" />
          )}
        </div>
      </button>
    </div>
  );
};

export default MobileBottomNav;
