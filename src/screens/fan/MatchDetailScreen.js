import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookingContext } from '../../context/BookingContext';
import { getMatchById, createReservation } from '../../services/api';

const MatchDetailScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const { user } = useContext(BookingContext);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { users, addBooking } = useContext(BookingContext);


  const fetchMatch = async () => {
    try {
      const data = await getMatchById(matchId);
      setMatch(data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les détails du match.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const handleBooking = async () => {
    if (!selectedCategory) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie.');
      return;
    }

    const ticket = match.tickets.find(t => t._id === selectedCategory);
    if (!ticket || ticket.disponibilité <= 0) {
      Alert.alert('Indisponible', 'Cette catégorie est épuisée.');
      return;
    }

    setBookingLoading(true);
    try {
      await createReservation({
        userId: user?.id, // ou null si non connecté
        ticketId: ticket._id,
        statut: 'réservé',
      });

      addBooking({
        id: Date.now(),
        teams: `${match.équipe_1} vs ${match.équipe_2}`,
        type: ticket.catégorie,
        date: match.date,
        location: match.lieu,
        seat: null,
        price: ticket.prix,
      });

      setMatch(prevMatch => ({
        ...prevMatch,
        tickets: prevMatch.tickets.map(t =>
          t._id === ticket._id
            ? { ...t, disponibilité: t.disponibilité - 1 }
            : t
        )
      }));

      Alert.alert(
        "Réservation confirmée",
        `Votre ticket pour ${match.team1} vs ${match.team2} a été réservé !`,
        [
          { text: "Voir mes tickets", onPress: () => navigation.navigate("Tickets") },
          { text: "OK", style: "cancel" }
        ]
      );
    } catch (error) {
      Alert.alert("Erreur", "Échec de la réservation.");
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !match) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des détails du match...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.matchHeader}>
        <Text style={styles.title}>{match.équipe_1} vs {match.équipe_2}</Text>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Icon name="calendar-today" size={20} color="#666" />
          <Text style={styles.detailText}>
            {format(new Date(match.date), "eeee d MMMM yyyy", { locale: fr })}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={20} color="#666" />
          <Text style={styles.detailText}>{match.heure}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="location-on" size={20} color="#666" />
          <Text style={styles.detailText}>{match.lieu}</Text>
        </View>
      </View>

      <View style={styles.ticketSection}>
        <Text style={styles.sectionTitle}>Catégories disponibles</Text>

        {match.tickets && match.tickets.length > 0 ? (
          match.tickets.map((ticket) => (
            <TouchableOpacity
              key={ticket._id}
              style={[
                styles.ticketType,
                selectedCategory === ticket._id && styles.selectedTicket
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === ticket._id ? null : ticket._id)
              }
            >
              <View style={styles.ticketTypeHeader}>
                <View
                  style={[
                    styles.radioButton,
                    selectedCategory === ticket._id && styles.radioButtonSelected
                  ]}
                >
                  {selectedCategory === ticket._id && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.ticketTypeTitle}>Catégorie {ticket.catégorie}</Text>
                <Text style={styles.ticketPrice}>{ticket.prix}€</Text>
              </View>
              <Text style={styles.ticketDescription}>
                Places disponibles : {ticket.disponibilité}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: '#666' }}>
            Aucune catégorie disponible pour ce match.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.bookButton,
          (!selectedCategory || bookingLoading) && styles.bookButtonDisabled
        ]}
        onPress={handleBooking}
        disabled={!selectedCategory || bookingLoading}
      >
        {bookingLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="confirmation-number" size={20} color="#fff" />
            <Text style={styles.bookButtonText}>Réserver</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5', minHeight: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#555', fontSize: 16 },
  header: { paddingVertical: 10 },
  matchHeader: { alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  detailCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailText: { fontSize: 16, color: '#555', marginLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' },
  ticketSection: { marginBottom: 30 },
  ticketType: {
    backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#eee'
  },
  selectedTicket: { borderColor: '#007AFF', backgroundColor: '#f0f7ff' },
  ticketTypeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  radioButton: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: '#ccc', justifyContent: 'center', alignItems: 'center'
  },
  radioButtonSelected: { borderColor: '#007AFF' },
  radioButtonInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#007AFF' },
  ticketTypeTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 10, flex: 1 },
  ticketPrice: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  ticketDescription: { fontSize: 14, color: '#666', marginLeft: 32 },
  bookButton: {
    backgroundColor: '#007AFF', borderRadius: 10, padding: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20
  },
  bookButtonDisabled: { opacity: 0.5 },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }
});

export default MatchDetailScreen;
