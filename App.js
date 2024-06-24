// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/loginScreen';
import AdminDashboardScreen from './src/screens/adminDashboardScreen';
import UserDashboardScreen from './src/screens/userDashboardScreen';
import CreateEnvioScreen from './src/screens/createEnvioScreen';
import EditEnvioScreen from './src/screens/editEnvioScreen';
import RegisterScreen from './src/screens/registerScreen';

const Stack = createStackNavigator();

const socialMediaIcons = () => (
  <View style={{ flexDirection: 'row', marginRight: 10 }}>
    <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com')}>
      <Ionicons name="logo-facebook" size={24} color="black" style={{ marginHorizontal: 5 }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com')}>
      <Ionicons name="logo-instagram" size={24} color="black" style={{ marginHorizontal: 5 }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => Linking.openURL('https://www.whatsapp.com')}>
      <Ionicons name="logo-whatsapp" size={24} color="black" style={{ marginHorizontal: 5 }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => Linking.openURL('https://www.tiktok.com')}>
      <Ionicons name="logo-tiktok" size={24} color="black" style={{ marginHorizontal: 5 }} />
    </TouchableOpacity>
  </View>
);

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setIsAdmin(user.role === 'admin');
      } else {
        setIsAdmin(false); // If there's no user, it's not admin
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerRight: socialMediaIcons }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerRight: socialMediaIcons }} 
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
          options={{ headerRight: socialMediaIcons }} 
        />
        <Stack.Screen 
          name="UserDashboard" 
          component={UserDashboardScreen} 
          options={{ headerRight: socialMediaIcons }} 
        />
        <Stack.Screen 
          name="CreateEnvio" 
          component={CreateEnvioScreen} 
          options={{ headerRight: socialMediaIcons }} 
        />
        <Stack.Screen 
          name="EditEnvio" 
          component={EditEnvioScreen} 
          options={{ headerRight: socialMediaIcons }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
