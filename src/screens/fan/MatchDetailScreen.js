// src/screens/fan/MatchDetailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Checkbox from 'expo-checkbox';

const MatchDetailScreen = ({ route }) => {
  const { match } = route.params;

  const [isVIP, setIsVIP] = useState(false);
  const [isNormal, setIsNormal] = useState(false);

  const handleBooking = () => {
    if (!isVIP && !isNormal) {
      Alert.alert('Erreur', 'Veuillez sélectionner un type de ticket.');
      return;
    }

    const selectedTypes = [];
    if (isVIP) selectedTypes.push('VIP');
    if (isNormal) selectedTypes.push('Normale');

    Alert.alert('Réservation confirmée', `Type(s) de ticket : ${selectedTypes.join(', ')}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{match.teams}</Text>
      
      <Text style={styles.detail}>
        📅 {format(new Date(match.date), "eeee d MMMM yyyy 'à' HH:mm", { locale: fr })}
      </Text>

      <Text style={styles.detail}>📍 {match.location}</Text>

      {/* Sélection des types de tickets */}
      <View style={styles.ticketSection}>
        <Text style={styles.subTitle}>Choisissez le type de ticket :</Text>

        <View style={styles.checkboxRow}>
          <Checkbox value={isVIP} onValueChange={setIsVIP} />
          <Text style={styles.checkboxLabel}>VIP</Text>
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox value={isNormal} onValueChange={setIsNormal} />
          <Text style={styles.checkboxLabel}>Normale</Text>
        </View>
      </View>

      {/* Bouton Réserver */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Réserver un ticket"
          onPress={handleBooking}
          color="#007AFF"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  ticketSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default MatchDetailScreen;
