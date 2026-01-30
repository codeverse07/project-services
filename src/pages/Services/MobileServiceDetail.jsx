import React from 'react';
import { ArrowLeft, Star, Clock, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'; // In real app use useParams to fetch data
import { services } from '../../data/mockData';

const MobileServiceDetail = ({ serviceId, onClose }) => {
    // Mock Data for "Menu Items" (Sub-services)
    const subServices = [
        { id: 101, name: "Basic Service", price: 499, description: "Includes diagnosis and minor repairs.", image: "https://images.unsplash.com/photo-1581578731117-104f2a9d4549?w=150&h=150&fit=crop" },
        { id: 102, name: "Premium Service", price: 999, description: "Deep cleaning + parts check + 30 day warranty.", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=150&h=150&fit=crop" },
        { id: 103, name: "Consultation", price: 199, description: "Expert visit and cost estimation.", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=150&h=150&fit=crop" },
    ];

    const [cart, setCart] = React.useState({}); // { id: qty }

    const updateQty = (id, delta) => {
        setCart(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const totalItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = subServices.reduce((sum, item) => sum + (item.price * (cart[item.id] || 0)), 0);

    const service = services.find(s => s.id === (serviceId || 1)) || services[0];

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[60] overflow-y-auto animate-in slide-in-from-bottom-full duration-500 will-change-transform pb-24 transition-colors">
            {/* Header Image with Parallax-like feel */}
            <div className="relative h-72 bg-gray-200 dark:bg-slate-800 w-full shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent z-10"></div>
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />

                {/* Navbar within modal */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white dark:bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center shadow-md text-gray-700 dark:text-white active:scale-95 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 bg-white dark:bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center shadow-md text-gray-700 dark:text-white active:scale-95 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl shadow-gray-100 dark:shadow-black/50 ring-1 ring-gray-50 dark:ring-slate-800 text-center">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{service.title}</h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-4">
                        <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100"><Star className="w-3.5 h-3.5 text-green-600 fill-current" /> {service.rating}</span>
                        <span>•</span>
                        <span>{service.reviews} reviews</span>
                        <span>•</span>
                        <span>45 mins</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-lg text-[11px] font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Home Service</div>
                        <div className="px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-lg text-[11px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Safe & Secure</div>
                    </div>
                </div>
            </div>

            {/* Menu Style List */}
            <div className="px-5 py-8 space-y-8">
                <div>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-1">Select Services</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500 font-medium mb-6">Customise your package</p>

                    <div className="space-y-6">
                        {subServices.map((item) => {
                            const qty = cart[item.id] || 0;
                            return (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-[15px]">{item.name}</h4>
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-gray-200 text-sm mb-2">₹{item.price}</div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-[90%]">{item.description}</p>
                                    </div>
                                    <div className="relative w-28 shrink-0 flex flex-col items-center">
                                        <div className="w-28 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* "ADD" Pill Button */}
                                        <div className="absolute -bottom-2 shadow-lg shadow-gray-200 dark:shadow-black/50 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 overflow-hidden min-w-[90px]">
                                            {qty === 0 ? (
                                                <button
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="w-full py-1.5 text-rose-600 dark:text-rose-400 font-extrabold text-sm uppercase tracking-wide hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                                >
                                                    ADD
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-between px-2 py-1.5 bg-white dark:bg-slate-800">
                                                    <button onClick={() => updateQty(item.id, -1)} className="text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold px-1 text-lg leading-none">-</button>
                                                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{qty}</span>
                                                    <button onClick={() => updateQty(item.id, 1)} className="text-rose-600 dark:text-rose-400 font-bold px-1 text-lg leading-none">+</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <hr className="border-dashed border-gray-200 dark:border-slate-800" />

                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-4 items-start">
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">100% Satisfaction Guarantee</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">Verified professionals & 30-day service warranty.</p>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom View Cart Bar - Shows only when items in cart */}
            {totalItemCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom duration-300">
                    <button className="w-full bg-rose-600 text-white p-4 rounded-xl shadow-xl shadow-rose-200 dark:shadow-rose-900/50 active:scale-[0.98] transition-all flex justify-between items-center group">
                        <div className="flex flex-col items-start px-2">
                            <span className="text-[10px] font-bold text-rose-200 uppercase tracking-wider">{totalItemCount} ITEMS</span>
                            <span className="text-lg font-bold">₹{totalPrice}</span>
                        </div>
                        <div className="flex items-center gap-2 pr-2 font-bold">
                            View Cart <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MobileServiceDetail;
