import result from 'postcss/lib/result';
import carpentryImg from '../assets/images/carpentry.png';
import plumbingImg from '../assets/images/plumbing.png';
import electricalImg from '../assets/images/electrical.png';
import acImg from '../assets/images/ac-repair.png';
import fridgeImg from '../assets/images/fridge-repair.png';
import transportImg from '../assets/images/transport.png';

export const categories = [
    { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', color: 'bg-orange-100 text-orange-600' },
    { id: 'electrical', name: 'Electrical', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'homeappliance', name: 'Home Appliance', icon: 'Refrigerator', color: 'bg-blue-100 text-blue-600' },
    { id: 'plumber', name: 'Plumber', icon: 'Droplets', color: 'bg-cyan-100 text-cyan-600' },
    { id: 'transport', name: 'Transport', icon: 'Truck', color: 'bg-green-100 text-green-600' },
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
        description: 'Furniture repair, assembly, and custom woodwork.',
    },
    {
        id: 2,
        title: 'Washing Machine Repair',
        category: 'homeappliance',
        rating: 4.7,
        reviews: 89,
        price: 399,
        image: fridgeImg,
        description: 'Diagnosis and repair of all washing machine brands and models.',
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
];

export const bookings = [
    {
        id: 101,
        serviceId: 1,
        serviceName: 'Expert Carpentry',
        status: 'Pending',
        date: 'Oct 24, 2023',
        time: '10:00 AM',
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
        technician: {
            name: 'Rajesh Kumar',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
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
        technician: {
            name: 'Priya Sharma',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
        },
        image: fridgeImg
    },
    {
        id: 104,
        serviceId: 4,
        serviceName: 'Electrician - General',
        status: 'Completed',
        date: 'Sep 28, 2023',
        time: '4:00 PM',
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
        technician: null,
        image: fridgeImg
    }
];
