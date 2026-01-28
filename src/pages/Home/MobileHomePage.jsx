import React, { useState, useEffect } from 'react';
import { Search, Mic, Tag, Star, Clock, ArrowRight } from 'lucide-react';
import { categories, services } from '../../data/mockData';
import MobileHeader from '../../components/mobile/MobileHeader';
import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import MobileServiceDetail from '../../pages/Services/MobileServiceDetail';
import { Link } from 'react-router-dom';

const MobileHomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-scroll banner
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Stories Data
  const stories = [
    { id: 1, name: 'Offers', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=150&h=150&fit=crop', viewed: false },
    { id: 2, name: 'New', image: 'https://images.unsplash.com/photo-1581578731117-104f2a9d4549?w=150&h=150&fit=crop', viewed: true },
    { id: 3, name: 'Cleaning', image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=150&h=150&fit=crop', viewed: false },
    { id: 4, name: 'Repair', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=150&h=150&fit=crop', viewed: false },
    { id: 5, name: 'Painting', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&h=150&fit=crop', viewed: false },
  ];

  const testimonials = [
    { id: 1, name: "Priya Sharma", text: "Amazing service! The cleaner was very professional.", rating: 5 },
    { id: 2, name: "Rahul Verma", text: "Fixed my AC in 30 mins. Highly recommended!", rating: 4.8 },
  ];

  const mindCategories = [
    ...categories,
    { id: 9, name: 'Massage', image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb8?w=150&h=150&fit=crop' },
    { id: 10, name: 'Salon', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=150&h=150&fit=crop' },
  ];

  // Auto-cycle categories scale effect
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategoryIndex((prev) => (prev + 1) % mindCategories.slice(0, 8).length);
    }, 1500); // Change every 1.5s
    return () => clearInterval(interval);
  }, []);

  const [activeCardId, setActiveCardId] = useState(null);

  // Intersection Observer for Zoom & Rotating Border Effect
  const observerRef = React.useRef(null);
  React.useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCardId(Number(entry.target.dataset.id));
          entry.target.classList.add('scale-[1.02]', 'shadow-2xl');
          entry.target.classList.remove('scale-100', 'shadow-md');
        } else {
          entry.target.classList.remove('scale-[1.02]', 'shadow-2xl');
          entry.target.classList.add('scale-100', 'shadow-md');
        }
      });
    }, { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" });

    const cards = document.querySelectorAll('.zoom-card');
    cards.forEach(card => observerRef.current.observe(card));

    return () => observerRef.current.disconnect();
  }, [services]); // Re-run if services change

  return (
    <div className="min-h-screen bg-[#FFFBF2] dark:bg-slate-950 pb-28 font-sans selection:bg-rose-100 dark:selection:bg-rose-900/30 transition-colors duration-300">
      {/* Service Detail Modal */}
      {selectedServiceId && (
        <MobileServiceDetail
          serviceId={selectedServiceId}
          onClose={() => setSelectedServiceId(null)}
        />
      )}

      <MobileHeader />

      <main className="space-y-8">

        {/* Search Bar - Sticky at Top */}
        <div className="px-4 sticky top-0 z-40 bg-[#FFFBF2]/95 dark:bg-slate-950/95 backdrop-blur-sm pb-4 pt-2 transition-colors duration-300">
          <div className="flex items-center gap-3">
            {/* Floating Search Input */}
            <div className="flex-1 relative shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-none rounded-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800 transition-colors group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-rose-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 border-none rounded-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-0 text-sm font-bold tracking-wide"
                placeholder="Search 'AC Service'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Isolated Round Mic Button */}
            <div className="w-11 h-11 shrink-0 rounded-full bg-white dark:bg-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer active:scale-90 transition-transform hover:border-rose-200 dark:hover:border-rose-800 group">
              <Mic className="h-5 w-5 text-rose-500" />
            </div>
          </div>
        </div>

        {/* What's on your mind? */}
        <div className="px-4">
          <h2 className="text-sm font-bold text-gray-800 dark:text-slate-200 mb-4 tracking-wide uppercase opacity-80 pl-1">What's on your mind?</h2>
          <div className="grid grid-cols-4 gap-y-6">
            {mindCategories.slice(0, 8).map((cat, index) => (
              <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div
                  className={`w-[4.2rem] h-[4.2rem] rounded-full overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 transition-all duration-700 bg-white dark:bg-slate-900
                    ${index === activeCategoryIndex ? 'scale-110 border-rose-400 ring-2 ring-rose-100 dark:ring-rose-900 shadow-lg' : 'group-hover:shadow-md'}`}
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className={`text-[10px] font-extrabold text-center uppercase tracking-tight leading-3 transition-colors duration-700 ${index === activeCategoryIndex ? 'text-rose-600 dark:text-rose-400' : 'text-gray-700 dark:text-slate-400'}`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>



        {/* Hero Banners */}
        <div className="pl-4 py-2">
          <div className="flex overflow-x-auto gap-4 pr-4 snap-x hide-scrollbar">
            {/* Banner 1 */}
            <div className="min-w-[88vw] h-44 bg-gradient-to-r from-rose-600 to-rose-700 rounded-3xl relative overflow-hidden snap-center flex items-center px-6 shadow-xl shadow-rose-200/50">
              <div className="text-white relative z-10">
                <div className="text-[10px] font-black opacity-80 mb-2 tracking-widest uppercase bg-white/20 inline-block px-2 py-0.5 rounded-md">Summer Special</div>
                <div className="text-3xl font-black italic leading-none mb-1">50%<br />OFF</div>
                <div className="text-xs font-bold opacity-90 mb-3">On AC Service</div>
                <button className="bg-white text-rose-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wide shadow-lg">Order Now</button>
              </div>
              <img src="https://images.unsplash.com/photo-1581094794329-cd56b50d7188?auto=format&fit=crop&w=300" className="absolute right-0 bottom-0 h-52 w-52 object-cover -rotate-12 translate-x-4 translate-y-4" alt="Offer" />
            </div>
            {/* Banner 2 */}
            <div className="min-w-[88vw] h-44 bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl relative overflow-hidden snap-center flex items-center px-6 shadow-xl shadow-indigo-200/50">
              <div className="text-white relative z-10">
                <div className="text-[10px] font-black opacity-80 mb-2 tracking-widest uppercase bg-white/20 inline-block px-2 py-0.5 rounded-md">New Launch</div>
                <div className="text-3xl font-black italic leading-none mb-1">SPA<br />AT HOME</div>
                <div className="text-xs font-bold opacity-90 mb-3">Relax & Rejuvenate</div>
                <button className="bg-white text-indigo-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wide shadow-lg">Explore</button>
              </div>
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=300" className="absolute right-0 bottom-0 h-52 w-52 object-cover -rotate-12 translate-x-4 translate-y-4 opacity-70 mix-blend-overlay" alt="Offer" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-rose-900/5 mx-6"></div>

        {/* Recommended Cards with Zoom Effect */}
        <div className="px-5 pb-4">
          <h2 className="text-xl font-black text-gray-800 dark:text-white mb-5 flex items-center gap-2">
            <span>Recommended</span>
            <span className="text-[10px] font-bold text-white bg-black dark:bg-rose-600 px-2 py-0.5 rounded-md uppercase tracking-wider">PRO</span>
          </h2>

          <div className="flex flex-col gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                data-id={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`zoom-card relative rounded-[2rem] shadow-md dark:shadow-black/40 ring-1 ring-transparent dark:ring-white/5 transition-all duration-300 transform scale-100 rotating-border mb-8 ${activeCardId === service.id ? 'active' : ''}`}
              >
                {/* Inner Content Wrapper - CRITICAL for Rotating Border to show effectively */}
                {/* Matches MobileSearchPage structure EXACTLY */}
                <div className="rounded-[2rem] overflow-hidden w-full h-full relative z-10 bg-white dark:bg-slate-900">
                  {/* Image Section */}
                  <div className="h-56 relative">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent"></div>
                    <div className="absolute top-5 left-5">
                      <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-black dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                        Best Seller
                      </span>
                    </div>
                    <div className="absolute top-5 right-5 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
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
                      <Clock className="w-3.5 h-3.5" />
                      <span>45 Mins</span>
                      <span className="mx-1">•</span>
                      <span>Home Services</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-gray-100 dark:border-slate-800 pt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase line-through">₹{service.price + 300}</span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">₹{service.price}</span>
                      </div>
                      <button className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide hover:bg-rose-600 hover:text-white transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating "TOP PICK" Badge - positioned EXACTLY as per user wish (overlapping border slightly) */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full shadow-lg shadow-rose-500/30 transition-all duration-300 ${activeCardId === service.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'}`}>
                  TOP PICK
                </div>
              </div>
            ))}</div>
        </div>

        {/* Happy Customers (Testimonials) - Restored */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4">Happy Customers</h2>
          <div className="grid gap-3">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-rose-50 dark:border-slate-800 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/20 shrink-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">{t.name}</h4>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(t.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">"{t.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <MobileBottomNav />
    </div>
  );
};

export default MobileHomePage;
