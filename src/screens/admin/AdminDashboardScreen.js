import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserManagementScreen from './UserManagementScreen';
import ClubManagementScreen from './ClubManagementScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import SalesScreen from './SalesScreen';
import SettingsScreen from './SettingsScreen'; // à créer
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const AdminDashboardScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Utilisateurs"
        component={UserManagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Clubs"
        component={ClubManagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="football-outline" size={30} color="#000" />
            
          ),
        }}
      />
      
      <Tab.Screen
        name="Paramètres"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ventes"
        component={SalesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="groups" color={color} size={size} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};

export default AdminDashboardScreen;
