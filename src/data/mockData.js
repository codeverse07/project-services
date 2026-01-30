import result from 'postcss/lib/result';

// Using Unsplash images for reliability and better aesthetics
// High reliability images selected for stability
const carpentryImg = 'https://images.unsplash.com/photo-1603533867307-b354255e3c32?auto=format&fit=crop&q=80&w=600';
const plumbingImg = 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=600';
const electricalImg = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600';
const acImg = 'https://images.unsplash.com/photo-1614271879007-a37a8585e510?auto=format&fit=crop&q=80&w=600';
const fridgeImg = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600'; // Fridge in room/kitchen
const washingMachineImg = 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=600';
const transportImg = 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=600';
const cleaningImg = 'https://images.unsplash.com/photo-1527513992451-b8d9620db0e5?auto=format&fit=crop&q=80&w=600'; // Clean room image
const cleaningIconImg = 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=600'; // Specific cleaning tools for category

export const categories = [
    { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', color: 'bg-orange-100 text-orange-600', image: carpentryImg },
    { id: 'electrical', name: 'Electrical', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600', image: electricalImg },
    { id: 'homeappliance', name: 'Home Appliance', icon: 'Refrigerator', color: 'bg-blue-100 text-blue-600', image: washingMachineImg }, // Using washing machine as generic home appliance
    { id: 'plumber', name: 'Plumber', icon: 'Droplets', color: 'bg-cyan-100 text-cyan-600', image: plumbingImg },
    { id: 'transport', name: 'Transport', icon: 'Truck', color: 'bg-green-100 text-green-600', image: transportImg },
    { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles', color: 'bg-purple-100 text-purple-600', image: cleaningIconImg },
];

export const services = [
    {
        id: 1,
        title: 'Expert Carpentry',
        category: 'carpentry',
        rating: 4.8,
        reviews: 124,
        price: 499,
        image: carpentryImg,
        description: 'Furniture repair, assembly, and custom woodwork. Professional carpenters.',
    },
    {
        id: 2,
        title: 'Washing Machine Repair',
        category: 'homeappliance',
        rating: 4.7,
        reviews: 89,
        price: 399,
        image: washingMachineImg,
        description: 'Diagnosis and repair of all washing machine brands (LG, Samsung, IFB, etc).',
    },
    {
        id: 3,
        title: 'General Plumbing',
        category: 'plumber',
        rating: 4.9,
        reviews: 215,
        price: 599,
        image: plumbingImg,
        description: 'Leak repair, pipe fitting, and bathroom general plumbing.',
    },
    {
        id: 4,
        title: 'Electrician - General',
        category: 'electrical',
        rating: 4.6,
        reviews: 56,
        price: 199,
        image: electricalImg,
        description: 'Fan repair, light installation, socket replacement, and more.',
    },
    {
        id: 5,
        title: 'Refrigerator Repair',
        category: 'homeappliance',
        rating: 4.8,
        reviews: 92,
        price: 449,
        image: fridgeImg,
        description: 'Expert repair for single and double door refrigerators.',
    },
    {
        id: 6,
        title: 'House Shifting / Transport',
        category: 'transport',
        rating: 4.9,
        reviews: 45,
        price: 1999,
        image: transportImg,
        description: 'Safe and local goods transport and house shifting services.',
    },
    {
        id: 7,
        title: 'Deep Home Cleaning',
        category: 'cleaning',
        rating: 4.8,
        reviews: 67,
        price: 899,
        image: cleaningIconImg,
        description: 'Full home deep cleaning service. Kitchen, Bathroom, Living room.',
    },
    {
        id: 8,
        title: 'Expert AC Repair',
        category: 'homeappliance',
        rating: 4.8,
        reviews: 150,
        price: 599,
        image: acImg,
        description: 'Split and Window AC repair, gas charging, and installation.',
    },
    // Electrical Services
    {
        id: 9,
        title: 'Inverter Installation',
        category: 'electrical',
        rating: 4.7,
        reviews: 42,
        price: 499,
        image: electricalImg,
        description: 'Safe installation of inverter and battery setup.',
    },
    {
        id: 10,
        title: 'Geyser Installation',
        category: 'electrical',
        rating: 4.8,
        reviews: 88,
        price: 399,
        image: electricalImg,
        description: 'Instant and storage geyser installation and repair.',
    },
    {
        id: 11,
        title: 'Fan Installation',
        category: 'electrical',
        rating: 4.6,
        reviews: 120,
        price: 149,
        image: electricalImg,
        description: 'Ceiling and exhaust fan installation.',
    },
    // Home Appliance Services
    {
        id: 12,
        title: 'DTH Installation',
        category: 'homeappliance',
        rating: 4.5,
        reviews: 30,
        price: 299,
        image: electricalImg, // Generic tech
        description: 'DTH dish installation and signal setting.',
    },
    {
        id: 13,
        title: 'Split AC Installation',
        category: 'homeappliance',
        rating: 4.9,
        reviews: 210,
        price: 999,
        image: acImg,
        description: 'Professional Split AC installation with drill work.',
    },
    {
        id: 14,
        title: 'Window AC Service',
        category: 'homeappliance',
        rating: 4.7,
        reviews: 95,
        price: 499,
        image: acImg,
        description: 'Wet servicing for Window AC units.',
    },
    {
        id: 15,
        title: 'Gas Refill & Checkup',
        category: 'homeappliance',
        rating: 4.8,
        reviews: 60,
        price: 1499,
        image: acImg,
        description: 'AC gas top-up and leakage inspection.',
    },
    {
        id: 16,
        title: 'Mixer Grinder Repair',
        category: 'homeappliance',
        rating: 4.4,
        reviews: 25,
        price: 199,
        image: electricalImg,
        description: 'Motor repair and jar coupler replacement.',
    },
    {
        id: 17,
        title: 'TV Installation',
        category: 'homeappliance',
        rating: 4.8,
        reviews: 140,
        price: 399,
        image: electricalImg,
        description: 'Wall mount installation for LED/LCD TVs.',
    },
    // Plumbing
    {
        id: 18,
        title: 'Plumbing Service',
        category: 'plumber',
        rating: 4.8,
        reviews: 90,
        price: 299,
        image: plumbingImg,
        description: 'General plumbing inspection and minor fixes.',
    },
    // Carpentry Extras
    {
        id: 19,
        title: 'Door Repair',
        category: 'carpentry',
        rating: 4.6,
        reviews: 55,
        price: 349,
        image: carpentryImg,
        description: 'Hinge fixing, lock replacement, and alignment.',
    },
];

export const bookings = [
    {
        id: 101,
        serviceId: 1,
        serviceName: 'Expert Carpentry',
        status: 'Pending',
        date: 'Oct 24, 2023',
        time: '10:00 AM',
        price: 499,
        technician: null,
        image: carpentryImg
    },
    {
        id: 102,
        serviceId: 3,
        serviceName: 'General Plumbing',
        status: 'Assigned',
        date: 'Oct 22, 2023',
        time: '2:30 PM',
        price: 599,
        technician: {
            name: 'Rajesh Kumar',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop'
        },
        image: plumbingImg
    },
    {
        id: 103,
        serviceId: 2,
        serviceName: 'Washing Machine Repair',
        status: 'Completed',
        date: 'Oct 15, 2023',
        time: '11:00 AM',
        price: 399,
        technician: {
            name: 'Priya Sharma',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
        },
        image: washingMachineImg
    },
    {
        id: 104,
        serviceId: 4,
        serviceName: 'Electrician - General',
        status: 'Completed',
        date: 'Sep 28, 2023',
        time: '4:00 PM',
        price: 199,
        technician: {
            name: 'Amit Singh',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
        },
        image: electricalImg
    },
    {
        id: 105,
        serviceId: 5,
        serviceName: 'Refrigerator Repair',
        status: 'Canceled',
        date: 'Aug 10, 2023',
        time: '12:00 PM',
        price: 449,
        technician: null,
        image: fridgeImg
    }
];
