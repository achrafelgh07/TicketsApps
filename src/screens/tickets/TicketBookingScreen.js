import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // ou autre selon ta lib d'icônes
import { deleteReservation, payReservation } from '../../services/api';
import { useNavigation } from '@react-navigation/native';  // Importation du hook

  

const TicketBookingScreen = () => {
  const { user } = useContext(AuthContext); // Assure-toi que le user contient _id
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  const fetchUserReservations = async () => {
    try {
      const response = await api.get('/reservations'); // Utilise ton instance Axios avec token
      const allReservations = response.data;

      // Filtrer les réservations par user connecté
      const filtered = allReservations.filter(
        (r) => r.id_utilisateur?._id === user._id && r.statut === 'réservé'
      );

      setReservations(filtered);
    } catch (error) {
      console.error('Erreur fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserReservations();
    }
  }, [user]);

  const renderReservation = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTeams}>
          {item.id_ticket?.id_match?.équipe_1} vs {item.id_ticket?.id_match?.équipe_2}
        </Text>
        <View
          style={[
            styles.ticketTypeBadge,
            item.id_ticket?.catégorie === 'VIP' ? styles.vipBadge : styles.standardBadge,
          ]}
        >
          <Text style={styles.ticketTypeText}>{item.id_ticket?.catégorie}</Text>
        </View>
      </View>
  
      <View style={styles.ticketInfoRow}>
        <Icon name="attach-money" size={18} color="#555" />
        <Text style={styles.ticketInfoText}>Prix: {item.id_ticket?.prix} MAD</Text>
      </View>
  
      <View style={styles.ticketInfoRow}>
        <Icon name="info" size={18} color="#555" />
        <Text style={styles.ticketInfoText}>Statut: {item.statut}</Text>
      </View>
  
      <View style={styles.ticketInfoRow}>
        <Icon name="event" size={18} color="#555" />
        <Text style={styles.ticketInfoText}>
          Réservé le: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.ticketFooter}>
  
  <TouchableOpacity
  onPress={async () => {
    try {
      await payReservation(item._id);
      fetchUserReservations(); // Recharge les réservations après suppression
      <Text style={styles.buttonText}>
      {item.statut === 'payé' ? 'Payé' : 'Payer'}
    </Text>
      
    } catch (error) {
      console.error('Erreur lors de la payment :', error);
    }
  }}
  style={[styles.actionButton, styles.payButton]}
  disabled={item.statut === 'payé'}
>
  <Text style={styles.buttonText}>Payer</Text>
</TouchableOpacity>

  <TouchableOpacity
  onPress={async () => {
    try {
      await deleteReservation(item._id);
      fetchUserReservations(); // Recharge les réservations après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  }}
  style={[styles.actionButton, styles.deleteButton]}
>
  <Text style={styles.buttonText}>Supprimer</Text>
</TouchableOpacity>
</View>

    </View>
  );
  

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mes Réservations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : reservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune réservation trouvée.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={reservations}
          keyExtractor={(item) => item._id}
          renderItem={renderReservation}
        />
      )}
  
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MatchList')}>
          <Icon name="home" size={28} color="#007AFF" />
          <Text style={[styles.navText, { color: '#007AFF' }]}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Tickets')}>
          <Icon name="confirmation-number" size={28} color="#333" />
          <Text style={styles.navText}>Mes Tickets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};

export default TicketBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 70,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ticketTypeBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  vipBadge: {
    backgroundColor: '#ffd700',
  },
  standardBadge: {
    backgroundColor: '#e0e0e0',
  },
  ticketTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketInfoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  deleteButton: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  
  payButton: {
    backgroundColor: '#28a745',
  },
  
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  

});
