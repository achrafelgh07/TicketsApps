import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';

const FILTERS = ['Tous', 'Aujourd’hui', 'Cette semaine', 'Ce mois'];

const SalesScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [salesStats, setSalesStats] = useState({ totalTickets: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(false);

  const applyFilter = async (filter) => {
    setSelectedFilter(filter);
    setLoading(true);
    
    try {
      // Appel API pour récupérer les statistiques en fonction du filtre
      const response = await axios.get(`http://10.0.2.2:5000/api/sales/stats`);
      setSalesStats(response.data); // Mettre à jour les statistiques de vente
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques :', error);
      Alert.alert('Erreur', 'Impossible de récupérer les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilter(selectedFilter);  // Charger les statistiques dès le début
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Supervision des ventes</Text>
      <Text style={styles.subtitle}>Filtrer les statistiques</Text>

      {/* Filtres */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === item && styles.activeFilter]}
            onPress={() => applyFilter(item)}
          >
            <Text style={[styles.filterText, selectedFilter === item && styles.activeFilterText]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Statistiques */}
      {loading ? (
        <Text style={styles.loading}>Chargement...</Text>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Tickets vendus :</Text>
            <Text style={styles.value}>{salesStats.totalTickets}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Revenu généré :</Text>
            <Text style={styles.value}>{salesStats.totalRevenue} MAD</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 10, textAlign: 'center', color: '#666' },

  filterList: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 16, color: '#333' },
  value: { fontSize: 20, fontWeight: 'bold', color: '#007bff', marginTop: 5 },
  loading: { fontSize: 18, color: '#333', textAlign: 'center' },
});

export default SalesScreen;
