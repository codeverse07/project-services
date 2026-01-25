import React from 'react';
import { Star, Clock, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const ServiceCard = ({ service, onBook }) => {
    return (
        <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 h-full">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10" />
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Price Tag */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-1">
                        <span className="text-xs font-medium text-slate-500">starts at</span>
                        <span className="text-sm font-bold text-slate-900">₹{service.price}</span>
                    </div>
                </div>

                {/* Rating Badge (Floating) */}
                <div className="absolute bottom-4 left-4 z-20">
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-100 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-800">{service.rating}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6 border-t border-slate-50 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>60 mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Instant Booking</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 mt-auto">
                    <Link to={`/services/${service.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full justify-center border-slate-200 hover:border-blue-600 hover:text-blue-600 px-2">
                            Details
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <Button
                            size="sm"
                            className="w-full justify-center bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-2 whitespace-nowrap"
                            onClick={() => onBook(service)}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
