// src/screens/auth/RegisterScreen.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';


const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await register({
        nom: fullName,
        email: email,
        mot_de_passe: password,
        type_utilisateur: 'user' // Adaptez selon votre logique
      });
  
      if (!result.success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Succès',
          textBody: 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
        });
        navigation.navigate('Login');
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erreur serveur',
        textBody: error.message || 'Une erreur inattendue est survenue.',
        button: 'Fermer',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/2.png')} style={styles.logo} />

        <Text style={styles.title}>Créer un compte</Text>

        <TextInput
          label="Nom complet"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          required
          style={styles.input}
        />

        <TextInput
          label="Adresse e-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          S'inscrire
        </Button>

        <Button
          onPress={() => navigation.navigate('Login')}
          style={styles.link}
          labelStyle={{ fontSize: 14 }}
          uppercase={false}
        >
          Déjà un compte ? Se connecter
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1a1a1a',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 10,
    borderRadius: 8,
  },
  link: {
    marginTop: 15,
  },
});

export default RegisterScreen;
