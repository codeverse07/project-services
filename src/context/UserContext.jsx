import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const generateReferralId = (email) => {
    if (!email) return 'RSV-GUEST';
    // Simple deterministic hash function
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `RSV-${Math.abs(hash).toString(16).toUpperCase()}`;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user_profile');
        if (savedUser) {
            const activeUser = JSON.parse(savedUser);
            if (!activeUser.referralId) {
                activeUser.referralId = generateReferralId(activeUser.email);
            }
            return activeUser;
        }
        return null; // Guest user by default
    });

    const [savedServices, setSavedServices] = useState(() => {
        const saved = localStorage.getItem('saved_services');
        return saved ? JSON.parse(saved) : [];
    });

    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem('user_addresses');
        return saved ? JSON.parse(saved) : [];
    });

    const [isChatOpen, setIsChatOpen] = useState(false);

    const isAuthenticated = !!user;

    useEffect(() => {
        if (user) {
            localStorage.setItem('user_profile', JSON.stringify(user));
        } else {
            localStorage.removeItem('user_profile');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('saved_services', JSON.stringify(savedServices));
    }, [savedServices]);

    useEffect(() => {
        localStorage.setItem('user_addresses', JSON.stringify(addresses));
    }, [addresses]);

    const login = (userData) => {
        const userProfile = {
            ...userData,
            referralId: generateReferralId(userData.email)
        };
        setUser(userProfile);
        // Load user specific addresses if they exist (mocking)
        if (userData.email === 'sachin@example.com' && addresses.length === 0) {
            setAddresses([
                { id: 1, type: 'Home', address: '123, Green Park, New Delhi', isDefault: true },
                { id: 2, type: 'Office', address: 'Plot 7, Cyber Hub, Gurugram', isDefault: false }
            ]);
        }
    };

    const logout = () => {
        setUser(null);
        setSavedServices([]);
        setAddresses([]);
    };

    const toggleSavedService = (serviceId) => {
        setSavedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const addAddress = (newAddr) => {
        const addrObj = {
            ...newAddr,
            id: Date.now(),
            isDefault: addresses.length === 0
        };
        setAddresses(prev => [...prev, addrObj]);
    };

    const removeAddress = (addressId) => {
        setAddresses(prev => {
            const filtered = prev.filter(a => a.id !== addressId);
            if (filtered.length > 0 && !filtered.find(a => a.isDefault)) {
                filtered[0].isDefault = true;
            }
            return filtered;
        });
    };

    const updateAddress = (newAddress) => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            address: newAddress,
            fullAddress: `${newAddress}, India` // Simplified for now
        }));
    };

    const updateProfile = (newData) => {
        if (!user) return;
        setUser(prev => {
            const updated = { ...prev, ...newData };
            // Regenerate referralId if email was changed
            if (newData.email && newData.email !== prev.email) {
                updated.referralId = generateReferralId(newData.email);
            }
            return updated;
        });
    };

    return (
        <UserContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            updateAddress,
            updateProfile,
            isChatOpen,
            setIsChatOpen,
            savedServices,
            toggleSavedService,
            addresses,
            addAddress,
            removeAddress
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
