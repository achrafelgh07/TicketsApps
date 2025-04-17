// src/screens/tickets/TicketBookingScreen.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  RefreshControl
} from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BookingContext } from '../../context/BookingContext';

const TicketBookingScreen = ({ navigation }) => {
  const { bookings, removeBooking } = useContext(BookingContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simule un rafraîchissement (remplacez par une vraie actualisation si nécessaire)
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.ticketCard}
      onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTeams}>{item.teams}</Text>
        <View style={[
          styles.ticketTypeBadge, 
          item.type === 'VIP' ? styles.vipBadge : styles.standardBadge
        ]}>
          <Text style={styles.ticketTypeText}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.ticketInfoRow}>
        <Icon name="location-on" size={18} color="#666" />
        <Text style={styles.ticketInfoText}>{item.location}</Text>
      </View>

      <View style={styles.ticketInfoRow}>
        <Icon name="calendar-today" size={18} color="#666" />
        <Text style={styles.ticketInfoText}>
          {format(new Date(item.date), "eeee d MMMM yyyy", { locale: fr })}
        </Text>
      </View>

      <View style={styles.ticketInfoRow}>
        <Icon name="access-time" size={18} color="#666" />
        <Text style={styles.ticketInfoText}>
          {format(new Date(item.date), "HH:mm", { locale: fr })}
        </Text>
      </View>

      {item.seat && (
        <View style={styles.ticketInfoRow}>
          <Icon name="event-seat" size={18} color="#666" />
          <Text style={styles.ticketInfoText}>Siège: {item.seat}</Text>
        </View>
      )}

      <View style={styles.ticketFooter}>
        <Text style={styles.ticketPrice}>{item.price}€</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => removeBooking(item.id)}
        >
          <Icon name="delete" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mes Réservations</Text>
      
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../assets/1.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>Aucun ticket réservé</Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => navigation.navigate('MatchList')}
          >
            <Text style={styles.ctaButtonText}>Voir les matches disponibles</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
        />
      )}
  
      {/* Barre de navigation en bas */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('MatchList')}
        >
          <Icon name="home" size={28} color="#333" />
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Tickets')}
        >
          <Icon name="confirmation-number" size={28} color="#007AFF" />
          <Text style={[styles.navText, { color: '#007AFF' }]}>Mes Tickets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  ticketCard: {
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 70, // Espace pour la navbar
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Ajustez selon vos besoins
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
    elevation: 8, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
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
});

export default TicketBookingScreen;