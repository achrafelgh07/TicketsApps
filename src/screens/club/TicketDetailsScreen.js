import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const TicketDetailsScreen = () => {
  const route = useRoute();
  const { matchId, matchName, tickets } = route.params;

  const calculateStats = (ticket) => {
    const sold = ticket.reservations?.filter(r => r.statut === "payé").length || 0;
    const reserved = ticket.reservations?.filter(r => r.statut === "réservé").length || 0;
    const revenue = sold * ticket.prix;
    const total = sold + reserved + (ticket.disponibilité || 0);
    const progress = total > 0 ? (sold / total) * 100 : 0;

    return { sold, reserved, revenue, progress };
  };

  const totalRevenue = tickets.reduce((sum, ticket) => {
    return sum + (ticket.reservations?.filter(r => r.statut === "payé").length || 0) * ticket.prix;
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Détails des Tickets</Text>
        <Text style={styles.subtitle}>{matchName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tickets.map((ticket) => {
          const { sold, reserved, revenue, progress } = calculateStats(ticket);

          return (
            <View key={ticket._id} style={styles.ticketCard}>
              <Text style={styles.ticketCategory}>{ticket.catégorie}</Text>
              <Text style={styles.ticketPrice}>Prix: {ticket.prix} ryal</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{sold}</Text>
                  <Text style={styles.statLabel}>Vendus</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{reserved}</Text>
                  <Text style={styles.statLabel}>Réservés</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{ticket.disponibilité}</Text>
                  <Text style={styles.statLabel}>Disponibles</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{revenue}</Text>
                  <Text style={styles.statLabel}>Revenu</Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
          );
        })}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Général</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Revenu Total:</Text>
            <Text style={styles.summaryValue}>{totalRevenue} ryal</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    padding: 15,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ticketPrice: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});

export default TicketDetailsScreen;