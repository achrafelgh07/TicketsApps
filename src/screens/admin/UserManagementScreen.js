import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUsers, registerUser, updateUser, deleteUser } from '../../services/api';
import { Picker } from '@react-native-picker/picker';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [nom, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('fan');
  const [mot_de_passe, setPass] = useState('azerty123');

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('fan');
    setPass('azerty123');
    setEditingUser(null);
  };

  const openModal = (user = null) => {
    if (user) {
      setName(user.nom);
      setEmail(user.email);
      setRole(user.type_utilisateur);
      setEditingUser(user);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert('Confirmer', 'Supprimer cet utilisateur ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
          } catch (error) {
            console.error('Erreur lors de la suppression', error);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!nom || !email || !role) return;

    try {
      if (editingUser) {
        const updatedUser = { nom, email, type_utilisateur: role };
        const res = await updateUser(editingUser._id, updatedUser);
        console.log("Réponse update:", res);

        const updated = res.data?.user || res.data || res;

        if (!updated || !updated._id) {
          console.error("Utilisateur mis à jour invalide :", res);
          return;
        }

        setUsers((prev) =>
          prev.map((u) => (u._id === updated._id ? updated : u))
        );
      } else {
        const newUser = {
          nom,
          email,
          type_utilisateur: role,
          mot_de_passe: mot_de_passe || 'azerty123',
        };
        const res = await registerUser(newUser);
        console.log("Réponse ajout :", res);

        const added = res.user || res.data || res;
        if (!added || !added._id) {
          console.error("Utilisateur ajouté invalide :", res);
          return;
        }

        setUsers((prev) => [...prev, added]);
      }

      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  const renderUser = ({ item }) => {
    if (!item || !item._id) return null;
    return (
      <View style={styles.userItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.nom}</Text>
          <Text>{item.email}</Text>
          <Text style={styles.role}>{item.type_utilisateur?.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.actionBtn}>
          <Icon name="edit" size={26} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionBtn}>
          <Icon name="delete" size={26} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des utilisateurs</Text>
      <FlatList
        data={users}
        keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
        renderItem={renderUser}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Modifier' : 'Ajouter'} un utilisateur
            </Text>
            <TextInput
              placeholder="Nom"
              style={styles.input}
              value={nom}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Mot de passe"
              style={styles.input}
              value={mot_de_passe}
              onChangeText={setPass}
              secureTextEntry
            />
            <View style={styles.input}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
              >
                <Picker.Item label="Choisir un rôle..." value="" />
                <Picker.Item label="Fan" value="fan" />
                <Picker.Item label="Club" value="club" />
              </Picker>
            </View>

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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: '600' },
  role: { fontSize: 12, color: 'gray' },
  actionBtn: { marginLeft: 10 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
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
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
});

export default UserManagementScreen;
