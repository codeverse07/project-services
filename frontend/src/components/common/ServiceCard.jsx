import React from 'react';
import { Star, Clock, Check } from 'lucide-react';
import Button from './Button';

const ServiceCard = ({ service, onBook, onDetails, isActive }) => {
    const handleAction = (e, callback) => {
        if (e) e.stopPropagation();
        if (callback) callback(service);
    };

    return (
        <div
            className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer"
            onClick={() => onDetails && onDetails(service)}
        >
            {/* Image Section - Vertical */}
            <div className="relative w-full h-56 shrink-0">
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10" />
                <img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${isActive ? 'scale-110' : 'scale-100'} group-hover:scale-110`}
                />

                {/* Rating Badge */}
                <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-20">
                    <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] md:text-xs font-bold text-slate-800 dark:text-slate-200">{service.rating}</span>
                    </div>
                </div>

                {/* Top Rated Badge */}
                {service.rating >= 4.5 && (
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
                        <div className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span className="hidden sm:inline">Top Rated</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2 line-clamp-2 md:line-clamp-1 group-hover:text-rose-600 md:group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {service.title}
                    </h3>
                    <p className="hidden md:block text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Actions & Price */}
                <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-3 md:pt-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest line-through leading-none">₹{service.price + 300}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm md:text-xl font-black text-slate-900 dark:text-white">₹{service.price}</span>
                                <span className="hidden md:inline text-[10px] font-bold text-slate-400">onwards</span>
                            </div>
                        </div>

                        <div className="flex gap-1.5 md:gap-2">
                            <Button
                                size="sm"
                                className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl shadow-lg transition-all duration-300 px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white md:bg-slate-900 md:hover:bg-blue-600 md:text-white md:text-sm md:tracking-normal md:font-medium md:shadow-slate-900/10 md:px-6 md:py-2.5"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBook(service);
                                }}
                            >
                                Book Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
