import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import MatchCard from '../../components/MatchCard';
import { getMatches } from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from '../../components/ProfileScreen';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const FILTER_TYPES = ['Tous', 'VIP', 'Normal'];

const MatchListScreen = ({ navigation }) => {
  const [state, setState] = useState({
    matches: [],
    filteredMatches: [],
    loading: true,
    refreshing: false,
    searchQuery: '',
    selectedCategory: null,
    profileVisible: false,
    user: null
  });

  // Mise à jour de l'état avec merge
  const updateState = (newState) => setState(prev => ({ ...prev, ...newState }));

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) updateState({ user: JSON.parse(storedUser) });
    } catch (err) {
      console.error('Erreur utilisateur:', err);
    }
  }, []);

  const fetchMatches = useCallback(async () => {
    try {
      updateState({ loading: true });
      const data = await getMatches();
      updateState({ 
        matches: data,
        filteredMatches: filterMatches(data, state.searchQuery, state.selectedCategory)
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les matches');
      console.error('Fetch error:', error);
    } finally {
      updateState({ loading: false, refreshing: false });
    }
  }, [state.searchQuery, state.selectedCategory]);

  const filterMatches = (matches, query, category) => {
    return matches.filter(match => {
      const matchesSearch = [match.équipe_1, match.équipe_2, match.lieu]
        .some(field => field.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || 
        match.tickets?.some(ticket => ticket.catégorie === category);
      
      return matchesSearch && matchesCategory;
    });
  };

  const handleSearch = (query) => {
    updateState({
      searchQuery: query,
      filteredMatches: filterMatches(state.matches, query, state.selectedCategory)
    });
  };

  const handleFilter = (category) => {
    const normalizedCategory = category === 'Tous' ? null : category;
    updateState({
      selectedCategory: normalizedCategory,
      filteredMatches: filterMatches(state.matches, state.searchQuery, normalizedCategory)
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadUser();
      fetchMatches();
    }, [])
  );

  const renderItem = useCallback(({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 50}
      useNativeDriver
    >
      <MatchCard 
        match={item}
        onPress={() => navigation.navigate('MatchDetail', { 
          matchId: item._id,
          match: item  
        })}
      />
    </Animatable.View>
  ), []);

  const renderFilterButton = useCallback((filterType) => {
    const isSelected = state.selectedCategory === filterType || 
      (filterType === 'Tous' && !state.selectedCategory);
    
    return (
      <TouchableWithoutFeedback 
        key={filterType}
        onPress={() => handleFilter(filterType)}
      >
        <LinearGradient
          colors={isSelected ? ['#007AFF', '#0051ad'] : ['#f0f0f0', '#e0e0e0']}
          style={[styles.filterButton, isSelected && styles.selectedFilter]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.filterText, isSelected && styles.selectedFilterText]}>
            {filterType}
          </Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }, [state.selectedCategory]);

  if (state.loading && !state.refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Animatable.Text 
          animation="pulse"
          style={styles.loadingText}
        >
          Chargement des matches...
        </Animatable.Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#ffffff', '#f8f8f8']}
          style={styles.header}
        >
          <SearchBar
            placeholder="Rechercher..."
            onChangeText={handleSearch}
            value={state.searchQuery}
            platform="ios"
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInput}
            searchIcon={<Icon name="search" size={24} color="#888" />}
            clearIcon={<Icon name="close" size={24} color="#888" />}
            inputStyle={styles.searchInputText}
          />
          
          <TouchableWithoutFeedback 
            onPress={() => updateState({ profileVisible: true })}
          >
            <Animatable.Image
              animation="bounceIn"
              source={{ 
                uri: state.user?.photo || 'https://randomuser.me/api/portraits/men/1.jpg'
              }}
              style={styles.profileImage}
            />
          </TouchableWithoutFeedback>
        </LinearGradient>

        {/* Filtres */}
        <View style={styles.filterContainer}>
          {FILTER_TYPES.map(renderFilterButton)}
        </View>

        {/* Liste */}
        <FlatList
          data={state.filteredMatches}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={fetchMatches}
              tintColor="#007AFF"
              colors={['#007AFF']}
              progressBackgroundColor="#ffffff"
            />
          }
          ListEmptyComponent={
            <Animatable.Text 
              animation="fadeIn"
              style={styles.emptyText}
            >
              {state.searchQuery ? 'Aucun résultat' : 'Aucun match disponible'}
            </Animatable.Text>
          }
        />

        {/* Modale Profil */}
        <ProfileScreen
          visible={state.profileVisible}
          onClose={() => updateState({ profileVisible: false })}
          user={state.user}
        />

        {/* Navigation Bas */}
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(245,245,245,0.95)']}
          style={styles.bottomNav}
        >
          {['home', 'confirmation-number'].map((icon, index) => (
            <TouchableWithoutFeedback 
              key={icon}
              onPress={() => navigation.navigate(index === 0 ? 'MatchList' : 'Tickets')}
            >
              <View style={styles.navButton}>
                <Icon 
                  name={icon} 
                  size={28} 
                  color={index === 0 ? '#007AFF' : '#666'} 
                />
                <Text style={[
                  styles.navText,
                  { color: index === 0 ? '#007AFF' : '#666' }
                ]}>
                  {index === 0 ? 'Accueil' : 'Tickets'}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </LinearGradient>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  searchInputText: {
    fontSize: 16,
    color: '#333',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
    gap: 10
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  selectedFilter: {
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedFilterText: {
    color: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: 25,
    borderRadius: 20,
    paddingVertical: 8
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
    paddingHorizontal: 30,
  },
});

export default MatchListScreen;