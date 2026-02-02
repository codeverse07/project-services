import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useUser } from '../../context/UserContext';
import repairImage from '../../assets/REPAIR.png';
import repairImage2 from '../../assets/repair2.png';
import repairImage3 from '../../assets/image.png';

const slides = [
    {
        image: repairImage,
        quote: "Reservice saved my weekend! The technician arrived within an hour and fixed my AC perfectly. Highly recommended!",
        author: "Sarah Jenkins",
        role: "Homeowner, Brooklyn"
    },
    {
        image: repairImage2,
        quote: "I never had to worry about safety or quality. All technicians are verified, polite, and know exactly what they’re doing.",
        author: "Michael Chen",
        role: "Business Owner"
    },
    {
        image: repairImage3,
        quote: "Finding a technician was super easy, and the website is very user-friendly. Everything just works smoothly.",
        author: "Emily Rodriguez",
        role: "Freelance Designer"
    }
];

const LoginPage = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const rightSectionRef = useRef(null);
    const navigate = useNavigate();
    const { login } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Form Entrance
        tl.from(formRef.current, {
            x: -50,
            opacity: 0,
            duration: 0.8,
        })
            .from(".stagger-item", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
            }, "-=0.4");

        // Slideshow Animation
        const slideshowTl = gsap.timeline({ repeat: -1 });
        const imageElements = gsap.utils.toArray(".slide-image");
        const textElements = gsap.utils.toArray(".slide-text");

        // Initial setup
        gsap.set(imageElements, { autoAlpha: 0, x: 40 });
        gsap.set(textElements, { autoAlpha: 0, x: 40 });

        // We assume imageElements and textElements have same length
        imageElements.forEach((img, i) => {
            const textContent = textElements[i];

            // Enter
            slideshowTl
                .to([img, textContent], {
                    duration: 2,
                    autoAlpha: 1,
                    x: 0,
                    ease: "power2.out",
                })
                // Stay
                .to([img, textContent], {
                    duration: 2.5,
                    x: 0,
                })
                // Exit
                .to([img, textContent], {
                    duration: 1.5,
                    autoAlpha: 0,
                    x: -40,
                    ease: "power2.in",
                });

            // Reset position for next loop (set immediateRender false to strictly happen in sequence)
            slideshowTl.set([img, textContent], { x: 40 });
        });
        // Floating Animation (Independent)
        gsap.to(imageElements, {
            y: -10, // Increased float
            duration: 3.5, // Slightly slower for smoother feel with larger movement
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock login delay
        setTimeout(() => {
            if (isExistingCustomer) {
                // Dummy verified ID for existing customers
                login({
                    name: 'Sachin Tendulkar',
                    address: 'Green Park, New Delhi',
                    fullAddress: '123, Green Park, New Delhi, India 110016',
                    phone: '+91 98765 43210',
                    email: email || 'sachin@example.com',
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
                    isVerified: true
                });
            } else {
                // New profile creation
                login({
                    name: name || 'Anonymous User',
                    address: address || 'New Delhi',
                    fullAddress: `${address}, India`,
                    phone: phone || '+91 00000 00000',
                    email: email,
                    image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name || 'Felix'}`
                });
            }
            setIsLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div ref={containerRef} className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form */}
            <div ref={formRef} className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white order-last lg:order-first">
                <div className="w-full max-w-md mx-auto py-6">
                    <div className="mb-6 stagger-item">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-blue-600">Reservice</span>
                        </Link>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
                            {isExistingCustomer ? 'Welcome Back' : 'Create your profile'}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {isExistingCustomer ? 'Login to your verified account.' : 'Join Reservice today for expert home help.'}
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6 stagger-item">
                        <button
                            onClick={() => setIsExistingCustomer(false)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isExistingCustomer ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            New Profile
                        </button>
                        <button
                            onClick={() => setIsExistingCustomer(true)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isExistingCustomer ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Existing Customer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 stagger-item">
                        {!isExistingCustomer && (
                            <Input
                                id="name"
                                label="Full Name"
                                placeholder="John Doe"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        )}

                        <Input
                            id="email"
                            label="Email Address"
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {!isExistingCustomer && (
                            <>
                                <Input
                                    id="phone"
                                    label="Phone Number"
                                    placeholder="+91 98765 43210"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />

                                <Input
                                    id="address"
                                    label="Service Address"
                                    placeholder="123, Green Park, New Delhi"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        <Input
                            id="password"
                            label="Password"
                            placeholder={isExistingCustomer ? "Enter your password" : "Choose a password"}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {isExistingCustomer && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                    <span className="text-slate-600">Remember me</span>
                                </label>
                                <a href="#" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">Forgot Password?</a>
                            </div>
                        )}

                        <Button
                            className="w-full shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:translate-y-[-1px] transition-transform duration-200 mt-4"
                            size="lg"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (isExistingCustomer ? 'Signing in...' : 'Creating account...')
                                : (isExistingCustomer ? 'Sign In' : 'Create Account')}
                        </Button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                <span className="text-sm font-bold text-slate-700">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="Facebook" />
                                <span className="text-sm font-bold text-slate-700">Facebook</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side: Slider & Branding */}
            <div ref={rightSectionRef} className="hidden lg:block relative bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col p-12">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full max-w-lg relative h-96">
                            {slides.map((slide, index) => (
                                <div key={index} className="slide-image absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <div className="relative w-64 h-64 mb-8">
                                        <div className="absolute inset-0 bg-blue-600/30 rounded-3xl blur-3xl animate-pulse"></div>
                                        <img
                                            src={slide.image}
                                            alt="Repair"
                                            className="w-full h-full object-contain relative z-10"
                                        />
                                    </div>
                                    <div className="slide-text">
                                        <p className="text-xl italic text-slate-300 mb-6 leading-relaxed">
                                            "{slide.quote}"
                                        </p>
                                        <div>
                                            <p className="text-lg font-bold text-white">{slide.author}</p>
                                            <p className="text-sm text-blue-400 font-medium uppercase tracking-widest">{slide.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
                        <p>© {new Date().getFullYear()} Reservice. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>

                {/* Background Shapes */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default LoginPage;
