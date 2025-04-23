import React, { createContext, useState } from 'react';

export const BookingContext = createContext({
  user: null,
  bookings: [],
  login: () => {},
  logout: () => {},
  addBooking: () => {},
});

export const BookingProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Par défaut : pas connecté
  const [bookings, setBookings] = useState([]);

  // Connexion manuelle
  const login = (userData) => {
    setUser(userData);
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    setBookings([]); // Optionnel : vide les réservations à la déconnexion
  };

  // Ajout d'une réservation
  const addBooking = (newBooking) => {
    const completeBooking = {
      ...newBooking,
      id: newBooking.id || Date.now(),
      bookingDate: newBooking.bookingDate || new Date().toISOString(),
    };

    setBookings((prev) => [...prev, completeBooking]);
  };

  return (
    <BookingContext.Provider value={{ user, bookings, login, logout, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};




