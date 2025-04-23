import React, { useContext, useState } from 'react';
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
  const { matches } = useContext(MatchContext);
  const [filter, setFilter] = useState('Tous');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord Club</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {['Tous', 'Aujourd\'hui', 'Cette semaine'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={matches}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => {
          const tickets = item.tickets || [];

          const totalTickets = tickets.length;
          const soldTickets = tickets.filter(t => !t.disponibilité).length;
          const remainingTickets = totalTickets - soldTickets;

          const averagePrice =
            totalTickets > 0
              ? (
                  tickets.reduce((sum, t) => sum + parseFloat(t.prix || 0), 0) /
                  totalTickets
                ).toFixed(2)
              : 0;

          const revenue = soldTickets * averagePrice;
          const progress = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

          return (
            <View style={styles.matchCard}>
              <View style={styles.matchHeader}>
                <Text style={styles.matchTitle}>{item.équipe_1} vs {item.équipe_2}</Text>
                <Text style={styles.matchDate}>{item.date} à {item.heure}</Text>
              </View>

              <Text style={styles.matchLieu}>📍 {item.lieu}</Text>

              <View style={styles.statsRow}>
                <Text style={styles.label}>🎟️ Tickets vendus: {soldTickets}/{totalTickets}</Text>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
              </View>

              <Text style={styles.revenue}>💰 Revenu généré : {revenue} €</Text>

              <View style={styles.statDetails}>
                <Text style={styles.detail}>Total : {totalTickets}</Text>
                <Text style={styles.detail}>Restants : {remainingTickets}</Text>
                <Text style={styles.detail}>Prix moyen : {averagePrice} €</Text>
              </View>
            </View>
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
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
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
