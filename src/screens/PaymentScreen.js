import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';

const PaymentScreen = ({ route }) => {
  const API_URL = 'http://10.0.2.2:5000';
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const { reservationId } = route.params;

  const fetchPaymentIntentClientSecret = async () => {
    const response = await axios.post(`${API_URL}/api/payments/create-payment-intent`, {
      amount: 1000,
      reservationId,
    });
    return response.data.clientSecret;
  };

  const payReservation = async (id) => {
    await axios.post(`${API_URL}/api/reservations/pay`, { reservationId: id });
  };

  const handlePayPress = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: { billingDetails: { email: 'user@email.com' } },
    });

    if (error) {
      Alert.alert('Erreur', error.message);
    } else if (paymentIntent) {
      try {
        await payReservation(reservationId);
        Alert.alert('Succès', 'Paiement effectué avec succès !');
      } catch (err) {
        Alert.alert('Paiement ok, mais erreur de mise à jour de réservation');
      }
    }
  };

  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={false}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />
      <Button onPress={handlePayPress} title={loading ? 'Paiement en cours...' : 'Payer 10 MAD'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  cardContainer: { height: 50, marginVertical: 30 },
  card: { backgroundColor: '#efefef' },
});

export default PaymentScreen;
