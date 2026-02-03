import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import { useUser } from './UserContext';
import { toast } from 'react-hot-toast';

const TechnicianContext = createContext();

export const useTechnician = () => useContext(TechnicianContext);

export const TechnicianProvider = ({ children }) => {
    const { user, isAuthenticated } = useUser();
    const [technicianProfile, setTechnicianProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);

    // Fetch Technician Profile if user is a TECHNICIAN
    useEffect(() => {
        const fetchTechnicianData = async () => {
            if (isAuthenticated && user?.role === 'TECHNICIAN') {
                try {
                    setLoading(true);
                    // Fetch technician profile by User ID (Backend allows filtering by user field)
                    const res = await client.get(`/technicians?user=${user._id}`);

                    if (res.data.status === 'success' && res.data.data.technicians.length > 0) {
                        setTechnicianProfile(res.data.data.technicians[0]);
                    } else {
                        // Profile doesn't exist yet (New registered technician)
                        setTechnicianProfile(null);
                    }
                } catch (error) {
                    console.error("Error fetching technician data", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchTechnicianData();
    }, [isAuthenticated, user]);

    const createProfile = async (profileData) => {
        try {
            const formData = new FormData();
            formData.append('bio', profileData.bio);
            // Append skills as array or multiple fields?
            // Joi expects array. formData usually handles array by repeating keys or stringifying.
            // Backend validation: Joi.string().trim() inside array.
            // If I append 'skills' multiple times, multer handles it? 
            // `upload.single('profilePhoto')` is middleware. 
            // It parses body. 
            // For array in FormData: profileData.skills.forEach(skill => formData.append('skills[]', skill));

            profileData.skills.forEach(skill => formData.append('skills', skill));

            if (profileData.location) {
                formData.append('location[type]', 'Point');
                formData.append('location[coordinates][0]', profileData.location.coordinates[0]);
                formData.append('location[coordinates][1]', profileData.location.coordinates[1]);
                formData.append('location[address]', profileData.location.address);
            }

            if (profileData.profilePhoto) {
                formData.append('profilePhoto', profileData.profilePhoto);
            }

            // Append documents
            if (profileData.documents) {
                if (profileData.documents.aadharCard) formData.append('aadharCard', profileData.documents.aadharCard);
                if (profileData.documents.panCard) formData.append('panCard', profileData.documents.panCard);
                if (profileData.documents.drivingLicense) formData.append('drivingLicense', profileData.documents.drivingLicense);
                if (profileData.documents.certificates) formData.append('certificates', profileData.documents.certificates);
            }

            const res = await client.post('/technicians/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setTechnicianProfile(res.data.data.profile);
            toast.success("Profile created successfully!");
            return { success: true };
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create profile");
            return { success: false, message: error.response?.data?.message };
        }
    };

    const updateStatus = async (isOnline) => {
        try {
            const res = await client.patch('/technicians/profile', { isOnline });
            setTechnicianProfile(prev => ({ ...prev, isOnline: res.data.data.profile.isOnline }));
            toast.success(isOnline ? "You are now Online" : "You are now Offline");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const subscribeToPush = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: 'BB40pUEc2e28ijP0qTRgDsAgxZufLdUNoPAfnGZHIYW6WgAXt0eWTNKBhEK9cZfkXnh7swDxQQjxbM_LKuLLWeo'
                });

                await client.post('/technicians/subscribe', subscription);
                console.log("Push subscription successful");
            } catch (error) {
                console.error("Push subscription failed", error);
            }
        }
    };

    const value = {
        technicianProfile,
        loading,
        createProfile,
        updateStatus,
        subscribeToPush,
        jobs
    };

    return <TechnicianContext.Provider value={value}>{children}</TechnicianContext.Provider>;
};
