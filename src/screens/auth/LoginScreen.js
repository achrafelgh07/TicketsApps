// src/screens/auth/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { BookingContext } from '../../context/BookingContext';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('admin'); // Valeur par défaut pour tester
  const [password, setPassword] = useState('admin'); // Valeur par défaut pour tester
  const [loading, setLoading] = useState(false); // Ajouté
  const { login } = useContext(AuthContext);
  const { login: loginBooking } = useContext(BookingContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        alert(result.error);
      } else {
        const user = result.user;
        loginBooking(user);
  
        // Redirection selon le type d'utilisateur
        switch (user.type_utilisateur) {
          case 'fan':
            navigation.navigate('MatchList');
            break;
          case 'club':
            navigation.navigate('ClubHome');
            break;
          case 'admin':
            navigation.navigate('admindash'); 
            break;
          default:
            alert("Type d'utilisateur inconnu");
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Se connecter" onPress={handleLogin} />
      )}
      <Text 
        style={styles.link} 
        onPress={() => navigation.navigate('Register')}
      >
        Pas de compte ? S'inscrire
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15, 
    paddingHorizontal: 10,
    fontSize: 16
  },
  link: { 
    color: 'blue', 
    textAlign: 'center', 
    marginTop: 15,
    fontSize: 16
  },
});

export default LoginScreen;