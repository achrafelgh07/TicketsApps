// src/screens/fan/MatchDetailScreen.js
import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Image,
  ActivityIndicator 
} from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookingContext } from '../../context/BookingContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Constantes pour les types de tickets
const TICKET_TYPES = {
  VIP: {
    name: 'VIP',
    price: 99.99,
    description: 'Accès privilégié, sièges premium, buffet inclus',
    seatPrefix: 'VIP'
  },
  NORMAL: {
    name: 'Standard',
    price: 49.99,
    description: 'Accès standard, sièges en tribune',
    seatPrefix: 'N'
  }
};

const MatchDetailScreen = ({ route, navigation }) => {
  const { match } = route.params;
  const { addBooking } = useContext(BookingContext);
  
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (!selectedTicketType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un type de ticket.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ticketConfig = TICKET_TYPES[selectedTicketType];
      addBooking({
        ...match,
        type: ticketConfig.name,
        price: ticketConfig.price,
        seat: `${ticketConfig.seatPrefix}-${Math.floor(Math.random() * (selectedTicketType === 'VIP' ? 100 : 500)) + 1}`
      });

      Alert.alert(
        'Réservation confirmée',
        `Votre ticket ${ticketConfig.name} a été ajouté avec succès!`,
        [
          { 
            text: 'Voir mes tickets', 
            onPress: () => navigation.navigate('Tickets') 
          },
          { 
            text: 'Continuer', 
            style: 'cancel' 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la réservation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.matchHeader}>
        <Text style={styles.title}>{match.teams}</Text>
        <Image
          source={{ uri: match.image || 'https://via.placeholder.com/150' }}
          style={styles.matchImage}
        />
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
          <Text style={styles.detailText}>
            {format(new Date(match.date), "HH:mm", { locale: fr })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="location-on" size={20} color="#666" />
          <Text style={styles.detailText}>{match.location}</Text>
        </View>
      </View>

      <View style={styles.ticketSection}>
        <Text style={styles.sectionTitle}>Types de tickets disponibles</Text>
        
        {Object.entries(TICKET_TYPES).map(([key, ticket]) => (
          <TouchableOpacity 
            key={key}
            style={[
              styles.ticketType, 
              selectedTicketType === key && styles.selectedTicket
            ]}
            onPress={() => setSelectedTicketType(selectedTicketType === key ? null : key)}
          >
            <View style={styles.ticketTypeHeader}>
              <View style={[
                styles.radioButton,
                selectedTicketType === key && styles.radioButtonSelected
              ]}>
                {selectedTicketType === key && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.ticketTypeTitle}>Ticket {ticket.name}</Text>
              <Text style={styles.ticketPrice}>{ticket.price}€</Text>
            </View>
            <Text style={styles.ticketDescription}>
              {ticket.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.bookButton}
        onPress={handleBooking}
        disabled={isLoading || !selectedTicketType}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="confirmation-number" size={20} color="#fff" />
            <Text style={styles.bookButtonText}>
              {selectedTicketType 
                ? `Réserver ticket ${TICKET_TYPES[selectedTicketType].name}`
                : 'Réserver maintenant'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  header: {
    paddingVertical: 10,
  },
  matchHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  matchImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  ticketSection: {
    marginBottom: 30,
  },
  ticketType: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedTicket: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  ticketTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 32,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    opacity: 1,
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default MatchDetailScreen;