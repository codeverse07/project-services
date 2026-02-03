import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Navigation, Calendar, Clock, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MobileBottomNav from '../../components/mobile/MobileBottomNav';
import { useUser } from '../../context/UserContext';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to handle map centering
const MapCenterer = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, 14, { animate: true });
        }
    }, [coords, map]);
    return null;
};

const TransportPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useUser();

    // UI State
    const [bookingType, setBookingType] = useState('city'); // 'city' or 'outstation'
    const [selectedVehicle, setSelectedVehicle] = useState('4-wheeler');
    const [source, setSource] = useState('Detecting location...');
    const [destination, setDestination] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [currentPos, setCurrentPos] = useState([28.6139, 77.2090]); // Default to Delhi
    const [destinationPos, setDestinationPos] = useState(null);
    const [showDateError, setShowDateError] = useState(false);
    const [bookingForSomeoneElse, setBookingForSomeoneElse] = useState(false);
    const [nearbyDrivers, setNearbyDrivers] = useState([]);

    // Generate mock drivers around a position
    const generateMockDrivers = (pos) => {
        const drivers = [];
        for (let i = 0; i < 5; i++) {
            drivers.push({
                id: i,
                pos: [
                    pos[0] + (Math.random() - 0.5) * 0.02,
                    pos[1] + (Math.random() - 0.5) * 0.02
                ],
                type: Math.random() > 0.5 ? '4-wheeler' : '2-wheeler'
            });
        }
        setNearbyDrivers(drivers);
    };

    // Initialize and watch map location
    useEffect(() => {
        let watchId;
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCurrentPos([lat, lng]);
                    if (!bookingForSomeoneElse) {
                        setSource("Your Current Location");
                    }
                    if (nearbyDrivers.length === 0) {
                        generateMockDrivers([lat, lng]);
                    }
                },
                (error) => {
                    console.error("Error watching location:", error);
                    if (source === 'Detecting location...') {
                        setSource("Delhi (Default)");
                    }
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 1000,
                    timeout: 5000
                }
            );
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [bookingForSomeoneElse]);

    const vehicles = [
        { id: '2-wheeler', name: '2 Wheeler', icon: '🛵', price: '₹40', desc: 'Best for short distance' },
        { id: '3-wheeler', name: '3 Wheeler', icon: '🛺', price: '₹80', desc: 'Economical city travel' },
        { id: '4-wheeler', name: '4 Wheeler', icon: '🚗', price: '₹120', desc: 'Comfortable & Safe' },
    ];

    const filteredVehicles = bookingType === 'outstation'
        ? vehicles.filter(v => v.id === '4-wheeler')
        : vehicles;

    useEffect(() => {
        if (bookingType === 'outstation' && selectedVehicle !== '4-wheeler') {
            setSelectedVehicle('4-wheeler');
        }
    }, [bookingType]);

    const handleDateChange = (e) => {
        const selected = new Date(e.target.value);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        if (selected < tomorrow) {
            setShowDateError(true);
        } else {
            setShowDateError(false);
        }
        setBookingDate(e.target.value);
    };

    const handleSearch = () => {
        // Mocking a destination search for visual feedback on map
        if (destination.length > 3) {
            setDestinationPos([currentPos[0] + 0.02, currentPos[1] + 0.02]);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-24 md:pb-0">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-bold">Transport</h1>
                    </div>
                </div>
            </header>

            <main className="pt-16 max-w-7xl mx-auto flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {/* Left Panel - Booking Controls */}
                <div className="w-full md:w-[400px] h-full overflow-y-auto p-4 space-y-6 custom-scrollbar border-r border-slate-200 dark:border-slate-800">

                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                        <button
                            onClick={() => setBookingType('city')}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${bookingType === 'city' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                        >
                            City
                        </button>
                        <button
                            onClick={() => setBookingType('outstation')}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${bookingType === 'outstation' ? 'bg-white dark:bg-slate-800 shadow-md text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}
                        >
                            Outstation
                        </button>
                    </div>

                    {/* Location Inputs */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                            <input
                                type="text"
                                placeholder="Source Location"
                                value={source}
                                readOnly={!bookingForSomeoneElse}
                                onChange={(e) => setSource(e.target.value)}
                                className={`w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl outline-none transition-all text-sm font-medium ${bookingForSomeoneElse
                                    ? 'border-blue-500 focus:ring-2 focus:ring-blue-500 cursor-text'
                                    : 'border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-80'
                                    }`}
                            />
                            {!bookingForSomeoneElse && (
                                <button
                                    onClick={() => setBookingForSomeoneElse(true)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    CHANGE
                                </button>
                            )}
                        </div>

                        {/* Booking for someone else toggle info */}
                        {bookingForSomeoneElse && (
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                    <Info className="w-3 h-3" /> Manual override active
                                </span>
                                <button
                                    onClick={() => {
                                        setBookingForSomeoneElse(false);
                                        setSource("Your Current Location");
                                    }}
                                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700 underline"
                                >
                                    USE CURRENT LOCATION
                                </button>
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                            <input
                                type="text"
                                placeholder="Destination Location"
                                value={destination}
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    handleSearch();
                                }}
                                className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Outstation Date Selection */}
                    <AnimatePresence>
                        {bookingType === 'outstation' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> TRAVEL DATE
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={handleDateChange}
                                        className={`w-full p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl outline-none text-sm font-medium transition-colors ${showDateError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:ring-rose-500'}`}
                                    />
                                    {showDateError && (
                                        <div className="flex items-center gap-2 text-rose-500 text-xs font-medium px-2">
                                            <AlertCircle className="w-3 h-3" />
                                            Outstation must be booked 1 day prior
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Vehicle Selection */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 px-1">CHOOSE CATEGORY</label>
                        <div className="grid grid-cols-1 gap-3">
                            {filteredVehicles.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVehicle(v.id)}
                                    className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group active:scale-[0.98] ${selectedVehicle === v.id
                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                        }`}
                                >
                                    <div className="text-3xl bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                        {v.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="font-bold text-sm">{v.name}</h4>
                                        <p className="text-xs text-slate-500">{v.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-blue-600 dark:text-blue-400">{v.price}</p>
                                        <p className="text-[10px] text-slate-400">Est. fare</p>
                                    </div>
                                    {selectedVehicle === v.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Book Button */}
                    <button
                        disabled={showDateError || (bookingType === 'outstation' && !bookingDate)}
                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${bookingType === 'city'
                            ? 'bg-blue-600 text-white shadow-blue-500/25 mt-4'
                            : 'bg-rose-600 text-white shadow-rose-500/25 mt-4'
                            }`}
                    >
                        {bookingType === 'city' ? 'Book City Ride' : 'Schedule Outstation'}
                    </button>
                </div>

                {/* Right Panel - Map */}
                <div className="hidden md:block flex-1 relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <MapContainer center={currentPos} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={currentPos} />

                        {/* Nearby Driver Markers */}
                        {nearbyDrivers.map(driver => (
                            <Marker
                                key={driver.id}
                                position={driver.pos}
                                icon={L.divIcon({
                                    className: 'custom-driver-icon',
                                    html: `<div style="font-size: 24px;">${driver.type === '4-wheeler' ? '🚗' : '🛵'}</div>`,
                                    iconSize: [30, 30],
                                    iconAnchor: [15, 15]
                                })}
                            />
                        ))}

                        {destinationPos && (
                            <>
                                <Marker position={destinationPos} />
                                <Polyline positions={[currentPos, destinationPos]} color={bookingType === 'city' ? '#2563eb' : '#e11d48'} weight={4} dashArray="10, 10" />
                                <MapCenterer coords={destinationPos} />
                            </>
                        )}
                    </MapContainer>

                    {/* Floating Map Controls */}
                    <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-2">
                        <button
                            onClick={() => {
                                if ("geolocation" in navigator) {
                                    navigator.geolocation.getCurrentPosition((position) => {
                                        setCurrentPos([position.coords.latitude, position.coords.longitude]);
                                    });
                                }
                            }}
                            className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                        >
                            <Navigation className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Live Info Overlay */}
                    <div className="absolute top-6 left-6 z-[400]">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 dark:border-slate-700/50 max-w-[240px]">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`w-2 h-2 rounded-full animate-pulse ${bookingType === 'city' ? 'bg-blue-500' : 'bg-rose-500'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Traffic Aware</span>
                            </div>
                            <h5 className="font-bold text-sm mb-1">Smooth Pickup</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">Driver is nearby. Estimated arrival in 4 mins.</p>
                        </div>
                    </div>
                </div>

                {/* Mobile Map Toggle (Mock) */}
                <div className="md:hidden flex-1 min-h-[300px] relative">
                    <MapContainer center={currentPos} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={currentPos} />

                        {/* Nearby Driver Markers for Mobile */}
                        {nearbyDrivers.map(driver => (
                            <Marker
                                key={driver.id}
                                position={driver.pos}
                                icon={L.divIcon({
                                    className: 'custom-driver-icon',
                                    html: `<div style="font-size: 20px;">${driver.type === '4-wheeler' ? '🚗' : '🛵'}</div>`,
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12]
                                })}
                            />
                        ))}

                        {destinationPos && (
                            <>
                                <Marker position={destinationPos} />
                                <Polyline positions={[currentPos, destinationPos]} color={bookingType === 'city' ? '#2563eb' : '#e11d48'} weight={4} dashArray="10, 10" />
                            </>
                        )}
                        <MapCenterer coords={destinationPos || currentPos} />
                    </MapContainer>
                </div>
            </main>

            <MobileBottomNav />
        </div>
    );
};

export default TransportPage;

