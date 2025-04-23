import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

const MatchCard = ({ match, onPress }) => {
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* En-tête du match */}
      <View style={styles.header}>
        <Text style={styles.team}>{match.équipe_1}</Text>
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.matchTime}>{match.heure}</Text>
        </View>
        <Text style={styles.team}>{match.équipe_2}</Text>
      </View>

      {/* Détails du match */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Icon name="calendar-today" size={16} color="#666" />
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.detailText}>{match.lieu}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

MatchCard.propTypes = {
  match: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    équipe_1: PropTypes.string.isRequired,
    équipe_2: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    heure: PropTypes.string.isRequired,
    lieu: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333'
  },
  vsContainer: {
    alignItems: 'center',
    marginHorizontal: 8
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3A44'
  },
  matchTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#666'
  }
});

export default MatchCard;
