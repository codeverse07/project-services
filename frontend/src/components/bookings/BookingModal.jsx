import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Loader2, FileText, MapPin, CheckCircle, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';
import Input from '../common/Input';

// Local Assets (Plan Images)
import basicImg from '../../assets/services/basic.png';
import premiumImg from '../../assets/services/premium.png';
import consultationImg from '../../assets/services/consultation.png';

const BookingModal = ({ isOpen, onClose, service, onConfirm }) => {
    const { user, isAuthenticated } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(0); // 0: Select Plan, 1: Details
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        description: '',
        pickupLocation: user?.addresses?.find(a => a.isPrimary)?.address || '',
        dropLocation: ''
    });

    // Sub-services from Service object (provided by AdminContext transform)
    const plans = service?.subServices || [
        { id: 'basic', name: "Basic Service", price: service?.price || 499, description: "Includes diagnosis and minor repairs.", isActive: true },
        { id: 'premium', name: "Premium Service", price: Math.round((service?.price || 499) * 2), description: "Deep cleaning + parts check + 30 day warranty.", isActive: true },
        { id: 'consultation', name: "Consultation", price: 199, description: "Expert visit and cost estimation.", isActive: true },
    ];

    const activePlans = plans.filter(p => p.isActive);

    const getPlanImage = (id) => {
        if (id === 'basic') return basicImg;
        if (id === 'premium') return premiumImg;
        return consultationImg;
    };

    // Update pickup location if user data loads or changes
    useEffect(() => {
        if (isOpen) {
            setStep(0); // Reset to first step when opened
            if (activePlans.length > 0) {
                setSelectedPlan(activePlans[0].id);
            }
        }
        if (user?.addresses?.find(a => a.isPrimary)) {
            setFormData(prev => ({
                ...prev,
                pickupLocation: prev.pickupLocation || user.addresses.find(a => a.isPrimary).address
            }));
        }
    }, [user, isOpen]);

    if (!isOpen || !service) return null;

    const isShiftingOrTransport = service?.category === 'houseshifting' || service?.category === 'transport';

    const handleNext = () => {
        if (selectedPlan) {
            setStep(1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const activePlan = activePlans.find(p => p.id === selectedPlan) || activePlans[0];

        // Simulate network delay
        setTimeout(() => {
            const bookingData = {
                ...formData,
                serviceId: service.id,
                serviceName: service.title,
                subServiceName: activePlan.name,
                image: service.image,
                price: activePlan.price
            };

            // Only include shifting-specific fields for relevant services
            if (!isShiftingOrTransport) {
                delete bookingData.dropLocation;
                delete bookingData.pickupLocation;
            }

            onConfirm(bookingData);
            setIsLoading(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] w-full ${step === 0 ? 'max-w-4xl' : 'max-w-md'} shadow-2xl p-0 relative overflow-hidden transition-all duration-500`}>
                {/* Header Pattern */}
                <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/5 -z-10" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-600 active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>

                {service.isComingSoon ? (
                    <div className="p-10 md:p-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-[2.5rem]">
                        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
                            <Sparkles className="w-12 h-12 text-rose-500" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 uppercase">
                            Coming Soon
                        </h2>
                        <p className="text-xl font-bold text-rose-500 animate-blink tracking-[0.2em] uppercase">
                            Stay Tuned!
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-6 max-w-sm font-medium">
                            We are working hard to bring {service.title} to your doorstep. This service will be live very soon!
                        </p>
                        <Button
                            variant="primary"
                            className="mt-10 rounded-2xl px-12 bg-slate-900 dark:bg-rose-600 text-white h-14 font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
                            onClick={onClose}
                        >
                            Back to Services
                        </Button>
                    </div>
                ) : (
                    <div className="relative overflow-hidden">
                        {/* Header Pattern only for standard booking */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/5 -z-10" />

                        {step === 0 ? (
                            /* Step 0: Plan Selection */
                            <div className="p-10">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Choose your plan</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                                        {service.title} <span className="mx-2 opacity-30">|</span> Select the best option for your needs
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {activePlans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 h-full flex flex-col group ${selectedPlan === plan.id
                                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-lg shadow-indigo-500/10'
                                                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
                                                }`}
                                        >
                                            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
                                                <img
                                                    src={getPlanImage(plan.id)}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt={plan.name}
                                                />
                                            </div>

                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{plan.name}</h4>
                                                <span className="font-black text-indigo-600 dark:text-indigo-400">₹{plan.price}</span>
                                            </div>

                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                                                {plan.description}
                                            </p>

                                            <div className={`mt-auto w-full h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedPlan === plan.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                                }`}>
                                                <CheckCircle className={`w-5 h-5 ${selectedPlan === plan.id ? 'opacity-100' : 'opacity-0'}`} />
                                                <span className="ml-2 text-xs font-bold uppercase tracking-widest">{selectedPlan === plan.id ? 'Selected' : 'Select'}</span>
                                            </div>

                                            {plan.id === 'premium' && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                                    Best Value
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        size="lg"
                                        className="bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl px-10 h-16 font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-3"
                                        onClick={handleNext}
                                    >
                                        Next Step <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Step 1: Details */
                            <div className="p-10">
                                <div className="mb-8">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 hover:underline flex items-center gap-1"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back to Plans
                                    </button>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Booking Details</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                        {activePlans.find(p => p.id === selectedPlan)?.name} <span className="mx-2 opacity-30">|</span> ₹{activePlans.find(p => p.id === selectedPlan)?.price}
                                    </p>
                                </div>

                                {isShiftingOrTransport && (
                                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl">
                                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
                                            <strong>Note:</strong> Final shifting price will be fixed after distance verification and on-site inspection.
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Date"
                                            type="date"
                                            icon={Calendar}
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            className="dark:bg-slate-800 dark:border-slate-700"
                                        />
                                        <Input
                                            label="Time"
                                            type="time"
                                            icon={Clock}
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            required
                                            className="dark:bg-slate-800 dark:border-slate-700"
                                        />
                                    </div>

                                    {isShiftingOrTransport && (
                                        <div className="space-y-4">
                                            <Input
                                                label="Pickup Location"
                                                placeholder="Enter origin address"
                                                icon={MapPin}
                                                value={formData.pickupLocation}
                                                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                                required
                                                className="dark:bg-slate-800 dark:border-slate-700"
                                            />
                                            <Input
                                                label="Drop Location"
                                                placeholder="Enter destination address"
                                                icon={MapPin}
                                                value={formData.dropLocation}
                                                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                                                required
                                                className="dark:bg-slate-800 dark:border-slate-700"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Description
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-4 left-4 text-slate-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <textarea
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 min-h-[120px] resize-none text-sm font-medium"
                                                placeholder="Describe your issue or requirements..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        size="lg"
                                        className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>Confirm Booking <CheckCircle className="w-5 h-5" /></>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
