import React, { useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import { MatchContext } from '../../context/MatchContext';

const ClubHomeScreen = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('Tous');
  const { matches, fetchMatches } = useContext(MatchContext);

  const navigateToTicketDetails = (match) => {
    navigation.navigate('TicketDetails', { 
      matchId: match._id,
      matchName: `${match.équipe_1} vs ${match.équipe_2}`,
      tickets: match.tickets 
    });
  };

useEffect(() => {
  const loadMatches = async () => {
    await fetchMatches();
  };
  loadMatches();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord Club</Text>
        <Text style={styles.revenue}>Active Matches</Text>
      </View>

      

      <FlatList
      
        data={matches}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => {
          const tickets = item.tickets || [];

          const totalTickets = tickets.reduce((total, ticket) => total + (ticket.disponibilité || 0), 0);
          const soldTickets = tickets.reduce((sum, t) => {
            const paid = t.reservations?.filter(r => r.statut === "payé").length || 0;
            return sum + paid;
          }, 0);
          const remainingTickets = totalTickets - soldTickets;

          const reservedTickets = tickets.reduce((sum, t) => {
            const reserved = t.reservations?.filter(r => r.statut === "réservé").length || 0;
            return sum + reserved;
          }, 0);

          const totalRevenue = tickets.reduce((sum, ticket) => {
            const paidForThisTicket = ticket.reservations?.filter(r => r.statut === "payé").length || 0;
            return sum + (paidForThisTicket * parseFloat(ticket.prix || 0));
          }, 0);
          
          // Prix moyen (alternative à votre version)
          const averagePrice = soldTickets > 0 
            ? (totalRevenue / soldTickets).toFixed(2)
            : 0;
          
          // Revenue total (plus précis que soldTickets * averagePrice)
          const revenue = totalRevenue;
          const progress = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

          return (
            <TouchableOpacity 
              style={styles.matchCard}
              onPress={() => navigateToTicketDetails(item)}
              activeOpacity={0.8} // Optionnel : pour l'effet de toucher
            >
              <View style={styles.matchHeader}>
                <Text style={styles.matchTitle}>{item.équipe_1} vs {item.équipe_2}</Text>
                <Text style={styles.matchDate}>{item.date}</Text>
              </View>
          
              <Text style={styles.matchLieu}>📍 {item.lieu}</Text>
          
              <View style={styles.statsRow}>
                <Text style={styles.label}>🎟️ Tickets vendus: {soldTickets}/{totalTickets}</Text>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
              </View>
          
              <Text style={styles.revenue}>💰 Revenu généré : {totalRevenue} ryal</Text>
          
              <View style={styles.statDetails}>
                <Text style={styles.detail}>Total : {totalTickets}</Text>
                <Text style={styles.detail}>Restants : {remainingTickets}</Text>
                <Text style={styles.detail}>Réservés : {reservedTickets}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun match pour l’instant.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.addButtonWrapper}
        onPress={() => navigation.navigate('AddMatch')}
      >
        <LinearGradient
          colors={['#f64f59', '#c471ed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButton}
        >
          <Icon name="plus" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF' },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  filtersContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 1,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#6C63FF',
  },
  filterText: { color: '#333' },
  filterTextActive: { color: '#fff' },
  matchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  matchTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  matchDate: { fontSize: 14, color: '#666' },
  matchLieu: { marginTop: 4, fontSize: 13, color: '#555' },
  statsRow: { marginTop: 12 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: '#444' },
  progressBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    backgroundColor: '#00C9A7',
    borderRadius: 8,
  },
  revenue: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#008080',
  },
  statDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detail: { fontSize: 13, color: '#555' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#888', fontSize: 16 },
  addButtonWrapper: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default ClubHomeScreen;
