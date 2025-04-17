// src/screens/tickets/TicketBookingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const TicketBookingScreen = () => {
  const [reservedTickets, setReservedTickets] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Simuler les tickets réservés (tu peux remplacer par ton propre système de stockage plus tard)
    const storedTickets = [
      {
        id: 1,
        teams: 'PSG vs Marseille',
        date: '2023-12-15T20:00:00',
        location: 'Parc des Princes',
        type: 'VIP',
      },
      {
        id: 2,
        teams: 'Lyon vs Monaco',
        date: '2023-12-20T18:30:00',
        location: 'Groupama Stadium',
        type: 'Normale',
      },
    ];
    setReservedTickets(storedTickets);
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.ticket}>
      <Text style={styles.teams}>{item.teams}</Text>
      <Text style={styles.info}>📍 {item.location}</Text>
      <Text style={styles.info}>🎟️ Type: {item.type}</Text>
      <Text style={styles.info}>🕓 {new Date(item.date).toLocaleString('fr-FR')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Tickets Réservés</Text>
      <FlatList
        data={reservedTickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Aucun ticket réservé.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  ticket: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  teams: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
});

export default TicketBookingScreen;
