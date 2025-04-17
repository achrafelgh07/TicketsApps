// src/screens/fan/MatchListScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import MatchCard from '../../components/MatchCard';
import { mockApi } from '../../services/mockApi';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MatchListScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getMatches()
      .then(data => setMatches(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Text>Chargement...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec profil */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <MatchCard 
            match={item} 
            onPress={() => navigation.navigate('MatchDetail', { match: item })}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      {/* Barre de navigation en bas */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={28} color="#333" />
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Tickets')}
        >
          <Icon name="confirmation-number" size={28} color="#333" />
          <Text style={styles.navText}>Mes Tickets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
  listContent: {
    paddingBottom: 20,
  },
});

export default MatchListScreen;