import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { categories, services } from '../../data/mockData';
import ServiceCard from '../../components/common/ServiceCard';
import Button from '../../components/common/Button';
import { useBookings } from '../../context/BookingContext';
import MobileHeader from '../../components/mobile/MobileHeader';
import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import MobileServiceDetail from '../../pages/Services/MobileServiceDetail';
import BookingModal from '../../components/bookings/BookingModal';

const ServicesPage = () => {
    const navigate = useNavigate();
    const { addBooking } = useBookings();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
    const containerRef = useRef(null);
    const [activeCardId, setActiveCardId] = useState(null);

    // Intersection Observer for Mobile Rotating Border
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveCardId(Number(entry.target.dataset.id));
                        // Add active class manually if React state lag is an issue, 
                        // but consistent with other pages we use state.
                        entry.target.classList.add('active');
                    } else {
                        // We don't remove active class instantly on scroll out to keep it smooth? 
                        // No, other pages toggle it.
                        entry.target.classList.remove('active');
                    }
                });
            },
            { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" }
        );

        const cards = document.querySelectorAll('.service-card-item');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [filteredServices]);

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
        // On mobile we might want to go straight to booking or details? 
        // User asked for "cards like this" implying the detail view.
        // Let's open the Mobile Detail view for mobile, and Modal for desktop maybe?
        // Or simpler: Open Mobile Detail view everywhere since it's responsive? 
        // Actually MobileServiceDetail has a "Add to Cart" that could lead to booking.
        // Let's assume on Mobile we open MobileServiceDetail.
        if (window.innerWidth < 768) {
            setIsMobileDetailOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleConfirmBooking = (bookingData) => {
        addBooking(bookingData);
        setIsModalOpen(false);
        navigate('/bookings');
    };

    return (
        <div ref={containerRef} className="relative min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-rose-900 overflow-hidden pb-20 md:pb-0 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="md:hidden">
                <MobileHeader />
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-100 dark:opacity-20" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/5 md:bg-blue-500/10 md:dark:bg-blue-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-300/20 dark:bg-slate-800/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 md:mb-10 animate-item">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Browse Services</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-lg">Connect with {filteredServices.length} top-rated professionals in your area.</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-rose-500 md:group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for 'Electrician'..."
                                className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 md:focus:ring-blue-500/20 focus:border-rose-500 md:focus:border-blue-500 transition-all w-full md:w-80 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="md" className="gap-2 hidden sm:flex bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Filters (Sticky) */}
                    <div className="lg:col-span-3 space-y-8 h-fit lg:sticky lg:top-24 animate-item hidden lg:block">
                        {/* Categories */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-5">Categories</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCategory === 'all' ? 'border-rose-600 md:border-blue-600' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-500'}`}>
                                        {selectedCategory === 'all' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600 md:bg-blue-600" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="category"
                                        className="hidden"
                                        checked={selectedCategory === 'all'}
                                        onChange={() => setSelectedCategory('all')}
                                    />
                                    <span className={`text-sm font-medium ${selectedCategory === 'all' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>All Services</span>
                                </label>
                                {categories.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCategory === cat.id ? 'border-rose-600 md:border-blue-600' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-500'}`}>
                                            {selectedCategory === cat.id && <div className="w-2.5 h-2.5 rounded-full bg-rose-600 md:bg-blue-600" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="category"
                                            className="hidden"
                                            checked={selectedCategory === cat.id}
                                            onChange={() => setSelectedCategory(cat.id)}
                                        />
                                        <span className={`text-sm font-medium ${selectedCategory === cat.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hidden lg:block">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-5">Rating</h3>
                            <div className="space-y-3">
                                {[4, 3, 2].map((stars) => (
                                    <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-slate-400 dark:group-hover:border-slate-500">
                                            {/* Dummy checkbox visual */}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                                                ))}
                                            </div>
                                            <span className="font-medium text-slate-400 dark:text-slate-600">& Up</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Category Pills */}
                    <div className="lg:hidden animate-item mb-4 overflow-x-auto pb-2 -mx-4 px-4 flex gap-2 hide-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="lg:col-span-9 animate-item">
                        {filteredServices.length > 0 ? (
                            <div className="filter-services-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                {filteredServices.map(service => (
                                    <div
                                        key={service.id}
                                        data-id={service.id}
                                        onClick={() => handleBookClick(service)}
                                        className={`service-card-item relative rounded-[2rem] shadow-md dark:shadow-black/40 ring-1 ring-transparent dark:ring-white/5 transition-all duration-300 transform scale-100 rotating-border group ${activeCardId === service.id ? 'active' : ''}`}
                                    >
                                        <div className="rounded-[2rem] overflow-hidden w-full h-full relative z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors">
                                            {/* Image Section */}
                                            <div className="h-56 relative overflow-hidden">
                                                <img src={service.image} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent"></div>
                                                <div className="absolute top-5 left-5">
                                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-black dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                                                        Best Seller
                                                    </span>
                                                </div>
                                                <div className="absolute top-5 right-5 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                                                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{service.title}</h3>
                                                    <div className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
                                                        {service.rating} <Star className="w-2.5 h-2.5 fill-current" />
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-1.5 text-[11px] font-bold text-gray-500 dark:text-slate-400 mb-4 uppercase tracking-wide">
                                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                                    <span>{service.category}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>Home Services</span>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-dashed border-gray-100 dark:border-slate-800 pt-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase line-through">₹{service.price + 300}</span>
                                                        <span className="text-lg font-black text-gray-900 dark:text-white">₹{service.price}</span>
                                                    </div>
                                                    <button className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide hover:bg-rose-600 hover:text-white transition-colors">
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating "TOP PICK" Badge - Only visible on Mobile when Active */}
                                        <div className={`md:hidden absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full shadow-lg shadow-rose-500/30 transition-all duration-300 ${activeCardId === service.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'}`}>
                                            TOP PICK
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No services found</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
                                    We couldn't find any services matching "<span className="font-medium text-slate-900 dark:text-white">{searchQuery}</span>". Try changing your filters.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                                    className="dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden">
                <MobileBottomNav />
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={selectedService}
                onConfirm={handleConfirmBooking}
            />

            {
                isMobileDetailOpen && selectedService && (
                    <MobileServiceDetail
                        serviceId={selectedService.id}
                        onClose={() => setIsMobileDetailOpen(false)}
                    />
                )
            }
        </div >
    );
};

export default ServicesPage;
