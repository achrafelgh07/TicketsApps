import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookedTickets, setBookedTickets] = useState([]);

  const addTicket = (ticket) => {
    setBookedTickets((prev) => [...prev, ticket]);
  };

  return (
    <BookingContext.Provider value={{ bookedTickets, addTicket }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
