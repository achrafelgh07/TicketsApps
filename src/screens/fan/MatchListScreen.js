import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import MatchCard from '../../components/MatchCard';
import { getMatches } from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MatchListScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filterByCategory = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      const response = await fetch(`http://10.0.2.2:5000/api/matches/with-tickets/${category}`);
      const data = await response.json();
      setMatches(data);
      setFilteredMatches(data);
    } catch (error) {
      console.error('Erreur de filtrage :', error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatches();
      console.log('Données reçues du backend :', data);
      setMatches(data);
      setFilteredMatches(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredMatches(matches);
    } else {
      const filtered = matches.filter(match => 
        match.team1.toLowerCase().includes(query.toLowerCase()) ||
        match.team2.toLowerCase().includes(query.toLowerCase()) ||
        match.venue.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMatches(filtered);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des matches...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec barre de recherche et bouton profil */}
      <View style={styles.header}>
        <SearchBar
          placeholder="Rechercher matches..."
          onChangeText={handleSearch}
          value={searchQuery}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInput}
          inputStyle={styles.searchInputText}
          lightTheme
          round
        />
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
      {/*filter*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
      <TouchableOpacity 
    onPress={() => {
      setSelectedCategory(null);
      fetchMatches();
    }}
    style={[styles.filterButton, !selectedCategory && styles.selectedFilter]}
  >
    <Text style={styles.filterText}>Tous</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    onPress={() => filterByCategory('VIP')}
    style={[styles.filterButton, selectedCategory === 'VIP' && styles.selectedFilter]}
  >
    <Text style={styles.filterText}>VIP</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    onPress={() => filterByCategory('normal')}
    style={[styles.filterButton, selectedCategory === 'normal' && styles.selectedFilter]}
  >
    <Text style={styles.filterText}>Normale</Text>
  </TouchableOpacity>
 
</View>

  
      {/* Liste des matches */}
      <FlatList
        data={filteredMatches}
        renderItem={({ item }) => (
          <MatchCard 
            match={item}
            onPress={() => navigation.navigate('MatchDetail', { 
              matchId: item._id, 
              match: item  // on passe tout l'objet
            })}
            
          />
        )}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'Aucun résultat trouvé' : 'Aucun match disponible'}
          </Text>
        }
      />
  
      {/* Barre de navigation en bas */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('MatchList')}
        >
          <Icon name="home" size={28} color="#007AFF" />
          <Text style={[styles.navText, { color: '#007AFF' }]}>Accueil</Text>
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
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    padding: 0,
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    height: 40,
  },
  searchInputText: {
    fontSize: 14,
  },
  profileButton: {
    marginLeft: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
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
    paddingBottom: 80,
    paddingTop: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});

export default MatchListScreen;