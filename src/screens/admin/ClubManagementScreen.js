import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
} from '../../services/api'; // ← ajuste le chemin si besoin

const ClubManagementScreen = () => {
  const [clubs, setClubs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setEditingClub(null);
  };

  const openModal = (club = null) => {
    if (club) {
      setName(club.name);
      setEmail(club.email);
      setEditingClub(club);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await getClubs();
      setClubs(response.data);
    } catch (error) {
      console.error('Erreur fetch clubs', error.response || error.message);
    }
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Erreur', 'Nom et email requis');
      return;
    }
    try {
      if (editingClub) {
        await updateClub(editingClub._id, { name, email });
      } else {
        await createClub({ name, email });
      }
      await fetchClubs();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l’enregistrement', error.response || error.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmation', 'Supprimer ce club ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteClub(id);
            await fetchClubs();
          } catch (error) {
            console.error('Erreur suppression', error.response || error.message);
          }
        },
      },
    ]);
  };

  const renderClub = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.iconBtn}>
        <MaterialIcons name="edit" size={24} color="#007bff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.iconBtn}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Gestion des Clubs</Text>

      <FlatList
        data={clubs}
        keyExtractor={(item) => item._id}
        renderItem={renderClub}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingClub ? 'Modifier' : 'Ajouter'} un club
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du club"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email du club"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={closeModal} style={styles.cancelBtn}>
                <Text>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={{ color: 'white' }}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  clubName: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' },
  iconBtn: { marginLeft: 10 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  cancelBtn: { marginRight: 15 },
  saveBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
});

export default ClubManagementScreen;
