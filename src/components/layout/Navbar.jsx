import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Wrench, User } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        if (isHomePage) {
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Check initial state
        } else {
            setIsScrolled(true); // Always "scrolled" (solid) on other pages
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Dynamic styles based on state
    const isTransparent = isHomePage && !isScrolled;

    // Base Classes
    const navClasses = `transition-all duration-300 z-50 ${isHomePage ? 'fixed w-full top-0' : 'sticky top-0 bg-white border-b border-slate-200'
        } ${isTransparent
            ? 'bg-transparent'
            : isHomePage ? 'bg-white/90 backdrop-blur-md shadow-sm' : ''
        }`;

    // Text Colors
    const textColorClass = isTransparent ? 'text-white' : 'text-slate-600 hover:text-blue-600';
    const activeColorClass = 'text-blue-600';
    const logoColorClass = isTransparent ? 'text-white' : 'text-slate-900';

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Bookings', path: '/bookings' },
    ];

    return (
        <nav className={navClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <span className={`text-xl font-bold transition-colors ${logoColorClass}`}>Reservice</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive
                                        ? activeColorClass
                                        : textColorClass
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`transition-colors ${isTransparent ? 'text-white hover:text-blue-200 hover:bg-white/10' : 'text-slate-600 hover:text-blue-600'}`}
                            >
                                Log in
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className={isTransparent ? 'shadow-lg shadow-blue-500/30' : ''}>
                                Sign up
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-md focus:outline-none transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white absolute w-full left-0 shadow-lg top-16">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-3 rounded-md text-base font-medium ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-slate-600">
                                    Log in
                                </Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full">
                                    Sign up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
