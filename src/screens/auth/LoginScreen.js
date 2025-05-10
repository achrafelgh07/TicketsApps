import React, { useState, useContext } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../../context/AuthContext';
import { BookingContext } from '../../context/BookingContext';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const { login: loginBooking } = useContext(BookingContext);

  const validateForm = () => {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Champs requis',
        textBody: 'Veuillez remplir tous les champs',
        button: 'OK',
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Email invalide',
        textBody: 'Veuillez entrer une adresse email valide',
        button: 'OK',
      });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const result = await login(credentials.email, credentials.password);
      
      if (!result.success) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Authentification échouée',
          textBody: result.error || 'Identifiants incorrects',
          button: 'Fermer',
        });
        return;
      }

      const user = result.user;
      loginBooking(user);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Bienvenue',
        textBody: `Connecté en tant que ${user.nom}`,
      });

      // Navigation handling
      const routes = {
        fan: 'MatchList',
        club: 'ClubHome',
        admin: 'admindash',
      };
      navigation.navigate(routes[user.type_utilisateur] || 'Auth');
      
    } catch (error) {
      console.error('Login Error:', error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erreur',
        textBody: 'Une erreur est survenue. Veuillez réessayer.',
        button: 'Fermer',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <Animatable.View 
        animation="fadeInUp" 
        duration={600} 
        style={styles.formContainer}
      >
        <Icon 
          name="shield-account" 
          size={80} 
          color={colors.primary} 
          style={styles.logo}
        />

        <Text variant="headlineMedium" style={styles.title}>
          Connexion à votre compte
        </Text>

        <TextInput
          label="        Adresse Email"
          value={credentials.email}
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          left={<TextInput.Icon icon="email-outline" />}
          disabled={isSubmitting}
          autoComplete="email"
        />

        <TextInput
          label="        Mot de passe"
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          mode="outlined"
          secureTextEntry={!credentials.showPassword}
          style={styles.input}
          left={<TextInput.Icon icon="lock-outline" />}
          right={
            <TextInput.Icon 
              icon={credentials.showPassword ? 'eye-off' : 'eye'} 
              onPress={() => setCredentials({ ...credentials, showPassword: !credentials.showPassword })}
            />
          }
          disabled={isSubmitting}
          autoComplete="password"
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={isSubmitting}
          disabled={isSubmitting}
          contentStyle={{ height: 48 }}
          labelStyle={styles.buttonLabel}
        >
          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
        </Button>

        <Button
          onPress={() => navigation.navigate('Register')}
          style={styles.link}
          labelStyle={styles.linkText}
          uppercase={false}
        >
          Vous n'avez pas de compte
        </Button>

        <Text style={styles.disclaimer}>
          En continuant, vous acceptez nos {' '}
          <Text style={styles.legalLink} onPress={() => navigation.navigate('Terms')}>
            Conditions d'utilisation
          </Text> {' '}et notre {' '}
          <Text style={styles.legalLink} onPress={() => navigation.navigate('Privacy')}>
            Politique de confidentialité
          </Text>
        </Text>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    marginBottom: 40,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    marginBottom: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  disclaimer: {
    marginTop: 32,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    color: '#666',
  },
  legalLink: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;