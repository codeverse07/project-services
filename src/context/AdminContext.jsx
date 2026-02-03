import React, { createContext, useContext, useState, useEffect } from 'react';
import { services as initialServices, categories as initialCategories, bookings } from '../data/mockData';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        return localStorage.getItem('admin_auth') === 'true';
    });

    const [appSettings, setAppSettings] = useState(() => {
        const savedSettings = localStorage.getItem('app_settings');
        return savedSettings ? JSON.parse(savedSettings) : {
            showWallet: false,
            showReferralBanner: false,
            adminEmail: 'admin@reservice.com',
            adminPassword: 'admin123'
        };
    });

    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem('admin_categories');
        return savedCategories ? JSON.parse(savedCategories) : initialCategories;
    });

    const [services, setServices] = useState(() => {
        const savedServices = localStorage.getItem('admin_services');
        let baseServices = savedServices ? JSON.parse(savedServices) : initialServices;

        // Migration: Update titles and sync house shifting prices
        baseServices = baseServices.map(s => {
            if (!s) return s;
            const isHouseshifting = s.category === 'houseshifting';
            const title = s.title || '';
            return {
                ...s,
                title: title.replace(' / Transport', '').replace(' / transport', ''),
                price: isHouseshifting ? 199 : s.price
            };
        });

        // Ensure every service has the required sub-service structure
        return baseServices.map(service => {
            const isHouseshifting = service.category === 'houseshifting';

            // For House Shifting, we FORCE only the consultation sub-service
            if (isHouseshifting) {
                return {
                    ...service,
                    subServices: [
                        { id: 'consultation', name: "Consultation & Quote", price: 199, description: "Expert visit for distance verification and fixed quote estimation.", isActive: true },
                    ]
                };
            }

            // For other services, maintain existing or apply defaults
            const defaultSubServices = [
                { id: 'basic', name: "Basic Service", price: service.price, description: "Includes diagnosis and minor repairs.", isActive: true },
                { id: 'premium', name: "Premium Service", price: Math.round(service.price * 2), description: "Deep cleaning + parts check + 30 day warranty.", isActive: true },
                { id: 'consultation', name: "Consultation", price: 199, description: "Expert visit and cost estimation.", isActive: true },
            ];

            return {
                ...service,
                subServices: service.subServices || defaultSubServices
            };
        });
    });

    const [technicians, setTechnicians] = useState(() => {
        const savedTechs = localStorage.getItem('admin_technicians');
        if (savedTechs) return JSON.parse(savedTechs);

        // Extract unique technicians from initial bookings if no local data
        const uniqueTechs = [];
        const seenNames = new Set();
        bookings.forEach(b => {
            if (b.technician && !seenNames.has(b.technician.name)) {
                uniqueTechs.push({
                    id: uniqueTechs.length + 1,
                    ...b.technician,
                    status: 'Available',
                    joinDate: 'Oct 2023'
                });
                seenNames.add(b.technician.name);
            }
        });
        return uniqueTechs;
    });

    useEffect(() => {
        localStorage.setItem('admin_auth', isAdminAuthenticated);
    }, [isAdminAuthenticated]);

    useEffect(() => {
        localStorage.setItem('app_settings', JSON.stringify(appSettings));
    }, [appSettings]);

    useEffect(() => {
        localStorage.setItem('admin_categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('admin_services', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem('admin_technicians', JSON.stringify(technicians));
    }, [technicians]);

    const login = (email, password) => {
        if (email === appSettings.adminEmail && password === appSettings.adminPassword) {
            setIsAdminAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdminAuthenticated(false);
    };

    const toggleSetting = (key) => {
        setAppSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const addCategory = (categoryData) => {
        setCategories(prev => [...prev, {
            ...categoryData,
            id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
            isActive: true
        }]);
    };

    const addService = (serviceData) => {
        const newId = Math.max(...services.map(s => s.id), 0) + 1;
        const basePrice = Number(serviceData.price) || 0;
        const isHouseshifting = serviceData.category === 'houseshifting';
        const subServices = isHouseshifting ? [
            { id: 'consultation', name: "Consultation & Quote", price: 199, description: "Expert visit for distance verification and fixed quote estimation.", isActive: true },
        ] : [
            { id: 'basic', name: "Basic Service", price: basePrice, description: "Includes diagnosis and minor repairs.", isActive: true },
            { id: 'premium', name: "Premium Service", price: Math.round(basePrice * 1.8), description: "Deep cleaning + parts check + warranty.", isActive: true },
            { id: 'consultation', name: "Consultation", price: 199, description: "Expert visit and cost estimation.", isActive: true },
        ];

        setServices(prev => [...prev, {
            ...serviceData,
            id: newId,
            rating: 5.0,
            reviews: 0,
            isActive: true,
            subServices
        }]);
    };

    const updateServicePrice = (id, newPrice) => {
        setServices(prev => prev.map(s =>
            s.id === id ? {
                ...s,
                price: Number(newPrice),
                subServices: s.subServices.map(ss =>
                    ss.id === 'basic' ? { ...ss, price: Number(newPrice) } : ss
                )
            } : s
        ));
    };

    const updateSubServicePrice = (serviceId, subServiceId, newPrice) => {
        setServices(prev => prev.map(s => {
            if (s.id === serviceId) {
                const updatedSubServices = s.subServices.map(ss =>
                    ss.id === subServiceId ? { ...ss, price: Number(newPrice) } : ss
                );
                // If we updated the 'basic' subservice, also update the main service price for legacy compatibility
                const mainPrice = subServiceId === 'basic' ? Number(newPrice) : s.price;
                return { ...s, price: mainPrice, subServices: updatedSubServices };
            }
            return s;
        }));
    };

    const toggleSubService = (serviceId, subServiceId) => {
        setServices(prev => prev.map(s =>
            s.id === serviceId ? {
                ...s,
                subServices: s.subServices.map(ss =>
                    ss.id === subServiceId ? { ...ss, isActive: !ss.isActive } : ss
                )
            } : s
        ));
    };

    const updateTechnician = (id, updatedData) => {
        setTechnicians(prev => prev.map(t =>
            t.id === id ? { ...t, ...updatedData } : t
        ));
    };

    const addTechnician = (techData) => {
        setTechnicians(prev => [
            ...prev,
            { ...techData, id: prev.length + 1 }
        ]);
    };

    return (
        <AdminContext.Provider value={{
            isAdminAuthenticated,
            appSettings,
            categories,
            services,
            technicians,
            login,
            logout,
            toggleSetting,
            addCategory,
            addService,
            updateServicePrice,
            updateSubServicePrice,
            toggleSubService,
            updateTechnician,
            addTechnician
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
