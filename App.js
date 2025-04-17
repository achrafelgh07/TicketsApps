// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import MatchListScreen from './src/screens/fan/MatchListScreen';
import MatchDetailScreen from './src/screens/fan/MatchDetailScreen'; 
import TicketBookingScreen from './src/screens/tickets/TicketBookingScreen';
import { BookingProvider } from './src/context/BookingContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MatchList" component={MatchListScreen} />
          <Stack.Screen name="MatchDetail" component={MatchDetailScreen} /> 
          <Stack.Screen name="Tickets" component={TicketBookingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </BookingProvider>
    </AuthProvider>
  );
}
