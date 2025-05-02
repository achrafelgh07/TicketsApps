import React, { useState } from 'react';
import { useEffect } from 'react';
import api from '../../services/api'; // Assure-toi que ce chemin correspond à ton fichier d'API
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const SettingsScreen = () => {
  const [taxRate, setTaxRate] = useState('10'); // en %
  const [serviceFee, setServiceFee] = useState('5'); // en % ou valeur fixe

  const handleSave = async () => {
    try {
      const data = {
        taxe: parseFloat(taxRate),
        frais_service: parseFloat(serviceFee),
      };
  
      await updateSettings(data);
      Alert.alert('Succès', 'Les paramètres ont été mis à jour avec succès ✅');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres :', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres ❌');
    }
  };
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetchSettings();
        const { taxe, frais_service } = response.data;
        setTaxRate(taxe.toString());
        setServiceFee(frais_service.toString());
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres :', error);
      }
    };
  
    loadSettings();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres globaux</Text>

      <Text style={styles.label}>Taxe (%) appliquée sur les tickets</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={taxRate}
        onChangeText={setTaxRate}
        placeholder="Ex: 10"
      />

      <Text style={styles.label}>Frais de service (valeur ou %)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={serviceFee}
        onChangeText={setServiceFee}
        placeholder="Ex: 5"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Enregistrer les modifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
