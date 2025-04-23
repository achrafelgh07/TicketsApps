import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MatchContext } from '../../context/MatchContext';
import { useNavigation } from '@react-navigation/native';
import { addMatchApi } from '../../services/api';

const AddMatchScreen = () => {
  const { addMatch } = useContext(MatchContext);
  const navigation = useNavigation();

  const [match, setMatch] = useState({
    team1: '',
    team2: '',
    stadium: '',
    date: new Date(),
    ticketQuantity: '',
    vipTicketQuantity: '',
    regularPrice: '',
    vipPrice: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || match.date;
    setShowDatePicker(false);
    setMatch({ ...match, date: currentDate });
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || match.date;
    setShowTimePicker(false);

    // Fusionne la date et l'heure
    const mergedDateTime = new Date(
      match.date.getFullYear(),
      match.date.getMonth(),
      match.date.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    );

    setMatch({ ...match, date: mergedDateTime });
  };

  const handleAddMatch = async () => {
    const {
      team1,
      team2,
      stadium,
      date,
      ticketQuantity,
      vipTicketQuantity,
      regularPrice,
      vipPrice,
    } = match;

    if (!team1 || !team2 || !stadium || !ticketQuantity || !vipTicketQuantity || !regularPrice || !vipPrice) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      await addMatch({
        ...match,
        date: date.toISOString(),
      });
      Alert.alert('Succès', 'Le match a été ajouté avec succès.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l’ajout du match.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Ajouter un Match</Text>

      <TextInput
        placeholder="Équipe 1"
        style={styles.input}
        value={match.team1}
        onChangeText={(text) => setMatch({ ...match, team1: text })}
      />

      <TextInput
        placeholder="Équipe 2"
        style={styles.input}
        value={match.team2}
        onChangeText={(text) => setMatch({ ...match, team2: text })}
      />

      <TextInput
        placeholder="Stade"
        style={styles.input}
        value={match.stadium}
        onChangeText={(text) => setMatch({ ...match, stadium: text })}
      />

      <View style={styles.dateTimeContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            Date: {match.date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateText}>
            Heure: {match.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={match.date}
          mode="date"
          display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={match.date}
          mode="time"
          display={Platform.OS === 'android' ? 'clock' : 'spinner'}
          onChange={onTimeChange}
        />
      )}

      <TextInput
        placeholder="Quantité de tickets Normaux"
        style={styles.input}
        keyboardType="numeric"
        value={match.ticketQuantity}
        onChangeText={(text) => setMatch({ ...match, ticketQuantity: text })}
      />

      <TextInput
        placeholder="Prix Normal (MAD)"
        style={styles.input}
        keyboardType="numeric"
        value={match.regularPrice}
        onChangeText={(text) => setMatch({ ...match, regularPrice: text })}
      />

      <TextInput
        placeholder="Quantité de tickets VIP"
        style={styles.input}
        keyboardType="numeric"
        value={match.vipTicketQuantity}
        onChangeText={(text) => setMatch({ ...match, vipTicketQuantity: text })}
      />

      <TextInput
        placeholder="Prix VIP (MAD)"
        style={styles.input}
        keyboardType="numeric"
        value={match.vipPrice}
        onChangeText={(text) => setMatch({ ...match, vipPrice: text })}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleAddMatch}>
        <Text style={styles.submitButtonText}>Ajouter le match</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: '#4b6cb7',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  timeButton: {
    backgroundColor: '#3a7bd5',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  dateText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#182848',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddMatchScreen;
