import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, ArrowLeft, Star, Clock, Filter, X } from 'lucide-react';
import { services } from '../../data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import MobileBottomNav from '../../components/mobile/MobileBottomNav';

const MobileSearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCardId, setActiveCardId] = useState(null);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    // Rotating Border CSS handled globally in index.css


    // Intersection Observer for Zoom & Rotating Effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveCardId(Number(entry.target.dataset.id));
                        entry.target.classList.add('scale-[1.02]', 'shadow-2xl');
                        entry.target.classList.remove('scale-100', 'shadow-md');
                    } else {
                        entry.target.classList.remove('scale-[1.02]', 'shadow-2xl');
                        entry.target.classList.add('scale-100', 'shadow-md');
                    }
                });
            },
            {
            },
            {
                root: null,
                threshold: 0.6, // Strict threshold - requires more visibility
                rootMargin: "-45% 0px -45% 0px" // Very narrow active zone in center
            }
        );

        const cards = document.querySelectorAll('.search-card');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [searchQuery]);

    const filteredServices = services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FFFBF2] dark:bg-slate-950 pb-24 font-sans transition-colors duration-300">

            {/* Search Header */}
            <div className="sticky top-0 z-30 bg-[#FFFBF2] dark:bg-slate-950 p-4 pb-2 transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 active:scale-95 text-gray-700 dark:text-slate-200">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white">Search</h1>
                </div>

                <div className="relative shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-none rounded-2xl bg-white dark:bg-slate-900 border border-rose-50/50 dark:border-slate-800">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-rose-500" />
                    </div>
                    <input
                        type="text"
                        autoFocus
                        className="block w-full pl-10 pr-10 py-3.5 border-none rounded-2xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all text-sm font-medium"
                        placeholder="Try 'Sofa Cleaning'..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-10 flex items-center px-2">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center border-l border-gray-100 dark:border-slate-800 ml-2 pl-2">
                        <Mic className="h-4 w-4 text-rose-500" />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
                    {['All', 'Repair', 'Cleaning', 'Painting', 'Salon', 'Plumber'].map((filter, i) => (
                        <button key={i} className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-bold text-gray-600 dark:text-slate-300 whitespace-nowrap shadow-sm hover:border-rose-200 dark:hover:border-rose-800 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 transition-all">
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="px-5 pt-2 flex flex-col gap-12" ref={scrollContainerRef}>
                <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 pl-1">
                    {filteredServices.length} Results Found
                </div>

                {filteredServices.map(service => (
                    <div
                        key={service.id}
                        data-id={service.id}
                        className={`search-card relative rounded-[2rem] shadow-md dark:shadow-black/40 ring-1 ring-transparent dark:ring-white/5 transition-all duration-300 transform scale-100 rotating-border ${activeCardId === service.id ? 'active' : ''}`}
                    >
                        <div className="rounded-[2rem] overflow-hidden w-full h-full relative z-10 bg-white dark:bg-slate-900 flex p-4 gap-4">
                            {/* Image */}
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-800">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-extrabold text-gray-900 dark:text-white text-base leading-tight mb-1">{service.title}</h3>
                                        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            {service.rating} <Star className="w-2 h-2 fill-current" />
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">Home Services • 45 mins</div>
                                </div>

                                <div className="flex justify-between items-end mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 dark:text-slate-500 line-through">₹{service.price + 200}</span>
                                        <span className="text-base font-black text-gray-900 dark:text-white">₹{service.price}</span>
                                    </div>
                                    <button className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-rose-600 hover:text-white transition-colors">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Indicator Label */}
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full shadow-lg shadow-rose-500/30 transition-all duration-300 ${activeCardId === service.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'}`}>
                            TOP PICK
                        </div>
                    </div>
                ))}
            </div>

            <MobileBottomNav />
        </div>
    );
};

export default MobileSearchPage;
