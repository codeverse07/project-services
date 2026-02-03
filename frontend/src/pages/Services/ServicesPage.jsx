import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Heart, ChevronDown, ChevronUp, Grid, Hammer, Zap, Refrigerator, Droplets, Truck, Home, Sparkles, ShieldCheck, Paintbrush, Lock, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { services as staticServices } from '../../data/mockData';
import ServiceCard from '../../components/common/ServiceCard';
import Button from '../../components/common/Button';
import { useBookings } from '../../context/BookingContext';
import { useAdmin } from '../../context/AdminContext';
import { useUser } from '../../context/UserContext';
import MobileHeader from '../../components/mobile/MobileHeader';
import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import MobileServiceDetail from '../../pages/Services/MobileServiceDetail';
import BookingModal from '../../components/bookings/BookingModal';



const ServicesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addBooking } = useBookings();
    const { services, categories } = useAdmin();
    const { isAuthenticated, savedServices, toggleSavedService } = useUser();
    const activeCategories = React.useMemo(() => categories.filter(c => c.isActive !== false), [categories]);

    const activeServices = React.useMemo(() => services.filter(s => s.isActive !== false), [services]);

    // Initialize category from state if available
    const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');

    // Update state if location changes
    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategory(location.state.category);
        }
    }, [location.state]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
    const containerRef = useRef(null);
    const [activeCardId, setActiveCardId] = useState(null);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

    // Intersection Observer for Mobile Rotating Border
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Only apply scroll-driven active class on mobile
                if (window.innerWidth >= 768) return;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveCardId(entry.target.dataset.id); // Keep as string
                        entry.target.classList.add('active');
                    } else {
                        entry.target.classList.remove('active');
                    }
                });
            },
            { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
        );

        const cards = document.querySelectorAll('.service-card-item');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [selectedCategory, searchQuery]); // Re-run when list changes

    // Filter services based on category and search
    const filteredServices = activeServices.filter((service) => {
        const matchesCategory =
            selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch = service.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle back logic
    const handleBack = () => {
        navigate(-1);
    };

    const handleBookClick = (service) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setSelectedService(service);
        if (window.innerWidth < 768) {
            // On mobile, Book Now button goes to the mobile details/plan selection page
            setIsMobileDetailOpen(true);
        } else {
            // On desktop, Book Now opens the direct booking flow modal
            setIsModalOpen(true);
        }
    };

    const handleDetailsClick = (service) => {
        setSelectedService(service);
        if (window.innerWidth < 768) {
            setIsMobileDetailOpen(true);
        } else {
            // Even on desktop, MobileServiceDetail can act as a details modal
            setIsMobileDetailOpen(true);
        }
    };

    const handleConfirmBooking = (bookingData) => {
        addBooking(bookingData);
        setIsModalOpen(false);
        navigate('/bookings');
    };

    const getCategoryIcon = (id) => {
        const icons = {
            carpentry: <Hammer className="w-5 h-5" />,
            electrical: <Zap className="w-5 h-5" />,
            homeappliance: <Refrigerator className="w-5 h-5" />,
            plumber: <Droplets className="w-5 h-5" />,
            transport: <Truck className="w-5 h-5" />,
            houseshifting: <Home className="w-5 h-5" />,
            cleaning: <Sparkles className="w-5 h-5" />,
            pestcontrol: <ShieldCheck className="w-5 h-5" />,
            gardening: <Droplets className="w-5 h-5" />,
            painting: <Paintbrush className="w-5 h-5" />,
            smarthome: <Lightbulb className="w-5 h-5" />,
            security: <Lock className="w-5 h-5" />,
            carwash: <Droplets className="w-5 h-5" />
        };
        return icons[id] || <Grid className="w-5 h-5" />;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.02
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                damping: 30,
                stiffness: 500
            }
        }
    };

    const sortedCategories = selectedCategory === 'All'
        ? activeCategories
        : [
            activeCategories.find(c => c.id === selectedCategory),
            ...activeCategories.filter(c => c.id !== selectedCategory)
        ].filter(Boolean);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-rose-900 overflow-hidden pb-24 md:pb-0 transition-colors duration-300 relative">

            {/* Background Decorations - Fixed to cover full viewport including behind header/footer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px] opacity-100 dark:opacity-50" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/5 md:bg-blue-500/10 md:dark:bg-blue-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-300/20 dark:bg-slate-800/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
            </div>

            {/* Mobile Header Removed for cleaner browse experience */}
            {/* <div className="md:hidden relative z-50">
                <MobileHeader className="bg-transparent" />
            </div> */}

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
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCategory === 'All' ? 'border-rose-600' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-500'}`}>
                                        {selectedCategory === 'All' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="category"
                                        className="hidden"
                                        checked={selectedCategory === 'All'}
                                        onChange={() => setSelectedCategory('All')}
                                    />
                                    <span className={`text-sm font-medium ${selectedCategory === 'All' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>All Services</span>
                                </label>
                                {sortedCategories.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCategory === cat.id ? 'border-rose-600' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-500'}`}>
                                            {selectedCategory === cat.id && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
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

                    {/* Mobile Category Pills / Grid Toggle */}
                    <div className="lg:hidden animate-item mb-4">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Categories</span>
                            <button
                                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-full active:scale-95 transition-all outline-none"
                            >
                                {isCategoriesExpanded ? (
                                    <><ChevronUp className="w-3 h-3" /> Collapse</>
                                ) : (
                                    <><ChevronDown className="w-3 h-3" /> View All</>
                                )}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isCategoriesExpanded ? (
                                <motion.div
                                    key="pills"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-x-auto pb-4 -mx-4 px-4 flex gap-2 hide-scrollbar"
                                >
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all shadow-sm ${selectedCategory === 'All' ? 'bg-rose-600 text-white shadow-rose-600/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
                                    >
                                        All ({activeServices.length})
                                    </button>
                                    {sortedCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all shadow-sm ${selectedCategory === cat.id ? 'bg-rose-600 text-white shadow-rose-600/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    layout
                                    key="grid"
                                    initial={{ opacity: 0, scale: 0.98, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, y: -5 }}
                                    transition={{ type: 'spring', damping: 30, stiffness: 450 }}
                                    className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-100/40 dark:bg-slate-900/40 rounded-[2rem] border border-slate-200/60 dark:border-white/5 backdrop-blur-md shadow-inner overflow-hidden mb-6"
                                >
                                    <button
                                        onClick={() => { setSelectedCategory('All'); setIsCategoriesExpanded(false); }}
                                        className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${selectedCategory === 'All' ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:shadow-md'}`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedCategory === 'All' ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 text-rose-600'}`}>
                                            <Grid className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-tight">All Services</span>
                                    </button>
                                    {activeCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.id); setIsCategoriesExpanded(false); }}
                                            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${selectedCategory === cat.id ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:shadow-md'}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 text-rose-600'}`}>
                                                {getCategoryIcon(cat.id)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tight text-center leading-tight">{cat.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Grid */}
                    <motion.div
                        layout
                        key={selectedCategory + searchQuery}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="lg:col-span-9"
                    >
                        {filteredServices.length > 0 ? (
                            <div className="filter-services-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 md:gap-6">
                                {filteredServices.map(service => (
                                    <motion.div
                                        key={service.id}
                                        variants={itemVariants}
                                        layout
                                        data-id={service.id}
                                        className={`service-card-item search-card-isolated relative rounded-[2rem] shadow-md dark:shadow-black/40 ring-1 ring-transparent dark:ring-white/5 transition-all duration-300 transform group ${String(activeCardId) === String(service.id) ? 'scale-[1.02] shadow-2xl' : 'scale-100'}`}
                                    >
                                        <ServiceCard
                                            service={service}
                                            onBook={handleBookClick}
                                            onDetails={handleDetailsClick}
                                            isActive={String(activeCardId) === String(service.id)}
                                        />
                                    </motion.div>
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
                                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                    className="dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </motion.div>
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
        </div>
    );
};

export default ServicesPage;
