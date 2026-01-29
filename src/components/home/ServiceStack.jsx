import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '../../data/mockData';
import WorkerCharacter from './WorkerCharacter';
import { Hammer, Zap, Refrigerator, Droplets, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
    Hammer,
    Zap,
    Refrigerator,
    Droplets,
    Truck
};

const ServiceStack = () => {
    const containerRef = useRef(null);
    const workerRef = useRef(null);
    const [activeCardId, setActiveCardId] = useState(categories[0].id);
    const [workerState, setWorkerState] = useState({
        pose: 'holding', // Default to holding so he looks ready
        mood: 'happy',
        x: 0,
        y: 0,
        opacity: 0, // Start hidden, reveal on first trigger
        scale: 0.8
    });

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.service-card');

            // Initial Worker State: Hidden and pushed down
            gsap.set(workerRef.current, { y: 100, opacity: 0 });

            // Worker Entrance Animation
            // Trigger when the first card hits the sticky position (top-60 = 240px)
            ScrollTrigger.create({
                trigger: cards[0], // Monitor the first card
                start: "top 240px", // When card top hits 240px from viewport top
                end: "bottom center", // Keep it active (or manage exit separately)
                onEnter: () => {
                    gsap.to(workerRef.current, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "back.out(1.7)",
                        overwrite: true
                    });
                },
                onLeaveBack: () => {
                    gsap.to(workerRef.current, {
                        y: 100,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.in",
                        overwrite: true
                    });
                }
            });

            // Worker Exit Animation
            // Trigger when the last card passes a certain point (user is done reading it)
            if (cards.length > 0) {
                const lastCard = cards[cards.length - 1];
                ScrollTrigger.create({
                    trigger: lastCard,
                    start: "top 0%", // Start fading out almost as soon as the last card appears
                    end: "bottom center",
                    onEnter: () => {
                        // Fade him out earlier so he's gone by the time the stack ends
                        gsap.to(workerRef.current, {
                            y: 100,
                            opacity: 0,
                            duration: 0.3, // Faster fade
                            ease: "power2.in",
                            overwrite: true
                        });
                    },
                    onLeaveBack: () => {
                        // Bring him back if we scroll back up
                        gsap.to(workerRef.current, {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            ease: "back.out(1.2)",
                            overwrite: true
                        });
                    }
                });
            }

            cards.forEach((card, index) => {
                ScrollTrigger.create({
                    trigger: card,
                    start: "top center", // When card hits center
                    end: "bottom center",
                    onEnter: () => setActiveCardId(categories[index].id),
                    onEnterBack: () => setActiveCardId(categories[index].id),
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-slate-50 py-20 px-4 md:px-10">

            {/* Header */}
            <div className="text-center mb-40 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Services</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">Expert solutions for every corner of your home.</p>
            </div>

            {/* Stack Container */}
            <div className="max-w-4xl mx-auto relative pb-10">
                {/* Worker Sticky Container */}
                {/* 
                    Cards are sticky top-60 (240px). 
                    Worker was -top-[174px] relative to card.
                    So Worker top should be 240px - 174px = 66px.
                    We use a zero-height container so it doesn't affect flow, 
                    but allows the worker to 'sit' there.
                */}
                <div className="sticky top-[68px] z-0 h-0 w-full pointer-events-none mb-0">
                    <div ref={workerRef} className="absolute left-1/2 -translate-x-1/2 -top-24 w-[400px] transform">
                        <WorkerCharacter pose="holding" mood="happy" className="drop-shadow-2xl" />
                    </div>
                </div>

                {categories.map((cat, index) => {
                    const isActive = activeCardId === cat.id;
                    const Icon = iconMap[cat.icon];
                    // Dynamic background based on brand color or simplified palette
                    const bgClass = cat.color.includes('orange') ? 'bg-orange-50 border-orange-200' :
                        cat.color.includes('blue') ? 'bg-blue-50 border-blue-200' :
                            cat.color.includes('green') ? 'bg-emerald-50 border-emerald-200' :
                                cat.color.includes('purple') ? 'bg-violet-50 border-violet-200' :
                                    'bg-white border-slate-200';

                    return (
                        <div
                            key={cat.id}
                            className={`service-card sticky top-60 mb-20 w-full rounded-[3rem] border-2 ${bgClass} shadow-xl transition-transform duration-500 z-40`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 md:gap-12 min-h-[400px] overflow-hidden rounded-[3rem]">
                                {/* Icon Side */}
                                <div className="shrink-0 relative group">
                                    <div className={`w-32 h-32 rounded-full bg-white shadow-md flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                                        {Icon && <Icon className="w-14 h-14 text-slate-800" strokeWidth={1.5} />}
                                    </div>
                                    <div className={`absolute inset-0 bg-current opacity-10 blur-xl rounded-full scale-125 ${cat.color.split(' ')[0]}`}></div>
                                </div>

                                {/* Content Side */}
                                <div className="text-center md:text-left pt-10 md:pt-0">
                                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{cat.name}</h3>
                                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                        {cat.description}
                                    </p>
                                    <button className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
                                        Book {cat.name}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* "Curtain" to physically cover the worker if he lingers */}
            <div className="relative w-full h-80 rounded-4xl bg-slate-800 z-10 -mt-40 pointer-events-none"></div>
        </div>
    );
};

export default ServiceStack;
