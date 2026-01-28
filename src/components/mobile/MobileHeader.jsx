import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  return (
    <div className="relative z-50 bg-[#FFFBF2] dark:bg-slate-950 pt-4 pb-4 px-4 transition-all">
      <div className="flex items-center justify-between">

        {/* Futuristic Location Pill */}
        <div className="flex flex-col max-w-[70%] group cursor-pointer">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent font-black text-[10px] uppercase tracking-widest mb-0.5 animate-pulse">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>HOME</span>
          </div>
          <div className="flex items-center gap-1 relative">
            <span className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate relative z-10 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Green Park, New Delhi</span>
            <div className="w-5 h-5 bg-rose-50 dark:bg-rose-500/20 rounded-full flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-300">
              <svg className="w-3 h-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Actions - Gradient Ring Profile */}
        <div className="flex items-center gap-3">
          <Link to="/profile" className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-orange-500 to-purple-500 active:scale-95 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border border-white dark:border-slate-800">
              {/* <span className="font-bold text-sm bg-gradient-to-br from-rose-500 to-purple-600 bg-clip-text text-transparent">S</span> */}
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
            </div>
            {/* Online/Active Dot */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
