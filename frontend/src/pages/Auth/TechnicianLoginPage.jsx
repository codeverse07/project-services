import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Briefcase, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useUser } from '../../context/UserContext';

// Using existing assets but with professional context
import repairImage from '../../assets/REPAIR.png';
import repairImage2 from '../../assets/repair2.png';
import repairImage3 from '../../assets/image.png';

const slides = [
    {
        image: repairImage,
        quote: "Since joining Reservice, my monthly earnings have increased by 40%. The platform is incredibly reliable and professional.",
        author: "David Miller",
        role: "Certified Electrician"
    },
    {
        image: repairImage2,
        quote: "The flexibility is what I love most. I choose my hours and manage my own team. Reservice handled all the marketing for me.",
        author: "Ananya Sharma",
        role: "Professional House Painter"
    },
    {
        image: repairImage3,
        quote: "Real-time tracking and automated payments make the job so much easier. I can focus on providing the best service.",
        author: "Kevin Peterson",
        role: "Master Plumber"
    }
];

const TechnicianLoginPage = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const rightSectionRef = useRef(null);
    const navigate = useNavigate();
    const { login, error } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        imageElements.forEach((img, i) => {
            const textContent = textElements[i];

            slideshowTl
                .to([img, textContent], {
                    duration: 2,
                    autoAlpha: 1,
                    x: 0,
                    ease: "power2.out",
                })
                .to([img, textContent], {
                    duration: 2.5,
                    x: 0,
                })
                .to([img, textContent], {
                    duration: 1.5,
                    autoAlpha: 0,
                    x: -40,
                    ease: "power2.in",
                });

            slideshowTl.set([img, textContent], { x: 40 });
        });

        gsap.to(imageElements, {
            y: -10,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await login(email, password);
        if (result.success) {
            // Even though any role can login, this page is specifically for partners
            if (result.user?.role === 'TECHNICIAN') {
                navigate('/technician/dashboard');
            } else {
                navigate('/');
            }
        } else {
            alert(result.message || 'Login failed');
        }
        setIsLoading(false);
    };

    return (
        <div ref={containerRef} className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form */}
            <div ref={formRef} className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white min-h-screen lg:min-h-0">
                <div className="w-full max-w-md mx-auto py-6">
                    <div className="mb-8 stagger-item">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">Reservice <span className="text-indigo-600 font-black">Technicians</span></span>
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Technician Portal</h1>
                        <p className="text-slate-500 font-medium">Manage your jobs, earnings, and profile in one place.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold stagger-item">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 stagger-item">
                        <Input
                            id="email"
                            label="Technician Email"
                            placeholder="pro@reservice.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            id="password"
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                                <span className="text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot Password?</a>
                        </div>

                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 py-4 text-xs uppercase tracking-widest font-black"
                            size="lg"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </Button>

                        <div className="pt-8 text-center border-t border-slate-100 mt-8">
                            <p className="text-sm text-slate-500 font-medium">
                                Not a partner yet?{' '}
                                <Link to="/technician/register" className="font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-8">
                                    Become a Technician
                                </Link>
                            </p>
                            <p className="text-xs text-slate-400 mt-6">
                                Not looking for work?{' '}
                                <Link to="/login" className="font-bold text-slate-600 hover:text-slate-900 transition-colors">
                                    User Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right: Decoration */}
            <div ref={rightSectionRef} className="hidden lg:block relative bg-gradient-to-br from-indigo-900 to-[#030712] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {slides.map((slide, index) => (
                        <img
                            key={index}
                            src={slide.image}
                            alt={`Success Story ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-contain slide-image opacity-80"
                            style={{ padding: '80px' }}
                        />
                    ))}
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-20 flex flex-col justify-end h-full p-20 text-white pointer-events-none bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent">
                    <div className="relative min-h-40">
                        {slides.map((slide, index) => (
                            <div key={index} className="absolute bottom-0 left-0 w-full slide-text">
                                <div className="flex gap-4 mb-6">
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest">Verified Pro</div>
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest">Top Earner</div>
                                </div>
                                <p className="text-2xl font-bold leading-snug mb-8 max-w-lg tracking-tight text-white italic">
                                    "{slide.quote}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianLoginPage;
