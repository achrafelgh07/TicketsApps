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
import TicketDetailsScreen from './src/screens/club/TicketDetailsScreen';
import ClubManagementScreen from './src/screens/admin/ClubManagementScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import SalesScreen from './src/screens/admin/SalesScreen';
import SettingsScreen from './src/screens/admin/SettingsScreen';
import UserManagementScreen from './src/screens/admin/UserManagementScreen';
import ProfileScreen from './src/components/ProfileScreen'; // ou le bon chemin
import PaymentScreen from './src/screens/PaymentScreen'

import { StripeProvider } from '@stripe/stripe-react-native';


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
      <MatchProvider>
        <StripeProvider publishableKey="pk_test_51RLUWJCWsIDMw35kcAOy0xt37bifAum8bHhcVOCsHOjgQ8rx7lqiJgyRYrW6hc0S6GHqb2wgCSTlJkgof4S4pFtb005SbqY41h">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MatchList" component={MatchListScreen} />
          <Stack.Screen name="MatchDetail" component={MatchDetailScreen} /> 
          <Stack.Screen name="Tickets" component={TicketBookingScreen} />
          <Stack.Screen name="AddMatch" component={AddMatchScreen} />
          <Stack.Screen name="ClubHome" component={ClubHomeScreen} />
          <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} options={{ title: 'Détails Tickets' }}/>
          <Stack.Screen name="ClubManagementScreen" component={ClubManagementScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="adminDash" component={AdminDashboardScreen} />
          <Stack.Screen name="SalesScreen" component={SalesScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  </MatchProvider>
  </BookingProvider>
    </AuthProvider>
  );
}
