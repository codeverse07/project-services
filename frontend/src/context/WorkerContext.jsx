import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import { useUser } from './UserContext';
import { toast } from 'react-hot-toast';

const WorkerContext = createContext();

export const useWorker = () => useContext(WorkerContext);

export const WorkerProvider = ({ children }) => {
    const { user, isAuthenticated } = useUser();
    const [workerProfile, setWorkerProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);

    // Fetch Worker Profile if user is a WORKER
    useEffect(() => {
        const fetchWorkerData = async () => {
            if (isAuthenticated && user?.role === 'WORKER') {
                try {
                    setLoading(true);
                    // Fetch worker profile by User ID (Backend allows filtering by user field)
                    const res = await client.get(`/workers?user=${user._id}`);

                    if (res.data.status === 'success' && res.data.data.workers.length > 0) {
                        setWorkerProfile(res.data.data.workers[0]);
                    } else {
                        // Profile doesn't exist yet (New registered worker)
                        setWorkerProfile(null);
                    }
                } catch (error) {
                    console.error("Error fetching worker data", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchWorkerData();
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

            const res = await client.post('/workers/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setWorkerProfile(res.data.data.profile);
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
            const res = await client.patch('/workers/profile', { isOnline });
            setWorkerProfile(prev => ({ ...prev, isOnline: res.data.data.profile.isOnline }));
            toast.success(isOnline ? "You are now Online" : "You are now Offline");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const value = {
        workerProfile,
        loading,
        createProfile,
        updateStatus,
        jobs
    };

    return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>;
};
