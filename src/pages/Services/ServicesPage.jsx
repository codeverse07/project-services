import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { categories, services } from '../../data/mockData';
import ServiceCard from '../../components/common/ServiceCard';
import Button from '../../components/common/Button';
import { useBookings } from '../../context/BookingContext';
import BookingModal from '../../components/bookings/BookingModal';

const ServicesPage = () => {
    const navigate = useNavigate();
    const { addBooking } = useBookings();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".animate-item", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleBookClick = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleConfirmBooking = (bookingData) => {
        addBooking(bookingData);
        setIsModalOpen(false);
        navigate('/bookings');
    };

    return (
        <div ref={containerRef} className="relative min-h-screen bg-slate-50 selection:bg-blue-100 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-item">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Browse Services</h1>
                        <p className="text-slate-500 mt-2 text-lg">Connect with {filteredServices.length} top-rated professionals in your area.</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for 'Electrician'..."
                                className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-80 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="md" className="gap-2 hidden sm:flex bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Filters (Sticky) */}
                    <div className="lg:col-span-3 space-y-8 h-fit lg:sticky lg:top-24 animate-item">
                        {/* Categories */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <h3 className="font-bold text-slate-900 mb-5">Categories</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCategory === 'all' ? 'border-blue-600' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                        {selectedCategory === 'all' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="category"
                                        className="hidden"
                                        checked={selectedCategory === 'all'}
                                        onChange={() => setSelectedCategory('all')}
                                    />
                                    <span className={`text-sm font-medium ${selectedCategory === 'all' ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>All Services</span>
                                </label>
                                {categories.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCategory === cat.id ? 'border-blue-600' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                            {selectedCategory === cat.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="category"
                                            className="hidden"
                                            checked={selectedCategory === cat.id}
                                            onChange={() => setSelectedCategory(cat.id)}
                                        />
                                        <span className={`text-sm font-medium ${selectedCategory === cat.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hidden lg:block">
                            <h3 className="font-bold text-slate-900 mb-5">Rating</h3>
                            <div className="space-y-3">
                                {[4, 3, 2].map((stars) => (
                                    <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center group-hover:border-slate-400">
                                            {/* Dummy checkbox visual */}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-current' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                            <span className="font-medium text-slate-400">& Up</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="lg:col-span-9 animate-item">
                        {filteredServices.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredServices.map(service => (
                                    <ServiceCard key={service.id} service={service} onBook={handleBookClick} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No services found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                    We couldn't find any services matching "<span className="font-medium text-slate-900">{searchQuery}</span>". Try changing your filters.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={selectedService}
                onConfirm={handleConfirmBooking}
            />
        </div>
    );
};

export default ServicesPage;
