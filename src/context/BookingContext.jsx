import React, { createContext, useState, useContext } from 'react';
import { bookings as initialBookings } from '../data/mockData';

const BookingContext = createContext();

export const useBookings = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState(initialBookings);

    const addBooking = (newBooking) => {
        const bookingWithId = {
            ...newBooking,
            id: Math.max(...bookings.map(b => b.id), 0) + 1,
            status: 'Pending',
            image: newBooking.image || 'https://images.unsplash.com/photo-1581578731117-1045293d2f28?q=80&w=1000&auto=format&fit=crop', // Default fallback
        };
        setBookings([bookingWithId, ...bookings]);
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking }}>
            {children}
        </BookingContext.Provider>
    );
};
