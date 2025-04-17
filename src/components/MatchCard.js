// src/components/MatchCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MatchCard = ({ match, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.teams}>{match.teams}</Text>
      <Text style={styles.date}>
        {format(new Date(match.date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
      </Text>
      <Text style={styles.location}>📍 {match.location}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teams: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    color: '#666',
    marginBottom: 3,
  },
  location: {
    color: '#444',
    fontStyle: 'italic',
  },
});

export default MatchCard;