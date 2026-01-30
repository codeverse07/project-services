import React from 'react';
import { User, Phone, Mail, MapPin, ChevronRight, LogOut, Settings, CreditCard, Heart, Wrench, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileBottomNav from '../../components/mobile/MobileBottomNav';

const ProfilePage = () => {
  // Mock User Data
  const user = {
    name: 'Sachin Tendulkar',
    phone: '+91 98765 43210',
    email: 'sachin@example.com',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop',
    address: '123, Green Park, New Delhi, India'
  };

  const menuItems = [
    { icon: Heart, label: 'Saved Services', path: '/saved' },
    { icon: MapPin, label: 'My Addresses', path: '/addresses' },
    { icon: CreditCard, label: 'Payment Methods', path: '/payments' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 md:pb-0 transition-colors duration-300">

      {/* Desktop Wrapper (Centered Card) */}
      <div className="max-w-2xl mx-auto pt-8 md:pt-16 px-4">

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden mb-6">
          <div className="h-32 relative">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000"
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 mb-4 gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-md overflow-hidden bg-white dark:bg-slate-800">
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm">{user.phone}</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-medium text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                <span className="text-gray-600 dark:text-slate-300 text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                <span className="text-gray-600 dark:text-slate-300 text-sm truncate">{user.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b last:border-b-0 border-gray-50 dark:border-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-gray-700 dark:text-slate-200 font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-slate-600" />
            </Link>
          ))}

          <button className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-600 dark:text-red-400 group mt-2 border-t border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>

      </div>

      {/* Mobile Footer Links (Moved from Main Footer) - Only visible on mobile */}
      <div className="md:hidden px-4 pt-8 pb-4 space-y-8">
        {/* Quick Links */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-slate-600 dark:text-slate-400 font-medium">About Us</Link></li>
            <li><Link to="/services" className="text-slate-600 dark:text-slate-400 font-medium">Our Services</Link></li>
            <li><Link to="/pricing" className="text-slate-600 dark:text-slate-400 font-medium">Pricing</Link></li>
            <li><Link to="/careers" className="text-slate-600 dark:text-slate-400 font-medium">Careers</Link></li>
            <li><Link to="/contact" className="text-slate-600 dark:text-slate-400 font-medium">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Services</h3>
          <ul className="space-y-3">
            <li><Link to="/services/carpentry" className="text-slate-600 dark:text-slate-400 font-medium">Carpentry</Link></li>
            <li><Link to="/services/electrical" className="text-slate-600 dark:text-slate-400 font-medium">Electrical</Link></li>
            <li><Link to="/services/home-appliances" className="text-slate-600 dark:text-slate-400 font-medium">Home Appliances</Link></li>
            <li><Link to="/services/plumbing" className="text-slate-600 dark:text-slate-400 font-medium">Plumbing</Link></li>
            <li><Link to="/services/transport" className="text-slate-600 dark:text-slate-400 font-medium">Transport</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">123, Green Park, New Delhi, India 110016</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-rose-600 dark:text-rose-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-rose-600 dark:text-rose-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">support@reservice.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Content (Moved from Main Footer) */}
      <div className="px-6 py-8 md:hidden flex flex-col items-center text-center border-t border-gray-100 dark:border-slate-800 mt-4 bg-white dark:bg-slate-900 mx-4 rounded-2xl shadow-sm mb-24">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Reservice
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 mb-6">
          <a href="#" className="w-10 h-10 rounded-full bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-slate-400 text-xs font-medium">
          <p>© {new Date().getFullYear()} Reservice. All rights reserved.</p>
        </div>
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div >
  );
};

export default ProfilePage;
