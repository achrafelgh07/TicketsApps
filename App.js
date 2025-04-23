// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import { MatchProvider } from './src/context/MatchContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import MatchListScreen from './src/screens/fan/MatchListScreen';
import MatchDetailScreen from './src/screens/fan/MatchDetailScreen'; 
import TicketBookingScreen from './src/screens/tickets/TicketBookingScreen';
import AddMatchScreen from './src/screens/club/AddMatchScreen';
import ClubHomeScreen from './src/screens/club/ClubHomeScreen';
import { BookingProvider } from './src/context/BookingContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
      <MatchProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ClubHome">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MatchList" component={MatchListScreen} />
          <Stack.Screen name="MatchDetail" component={MatchDetailScreen} /> 
          <Stack.Screen name="Tickets" component={TicketBookingScreen} />
          <Stack.Screen name="AddMatch" component={AddMatchScreen} />
          <Stack.Screen name="ClubHome" component={ClubHomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </MatchProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
