import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { username, password });
      const { token, role } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify({ username, role }));

      if (role === 'admin') {
        navigation.navigate('AdminDashboard', { isAdmin: true });
      } else {
        navigation.navigate('UserDashboard', { isAdmin: false });
      }
    } catch (error) {
      console.error('Login failed', error);
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    }
  };

  return (
    <ImageBackground source={require('../../assets/background2.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>GLOMA Portal Cliente</Text>
        <Text style={styles.subtitle}>Bienvenid@</Text>
        <Text style={styles.description}>Empecemos nuestra ruta juntos</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Has olvidado la contraseña?</Text>
        <Text style={styles.registerText}>
          ¿Aún no tienes cuenta?{' '}
          <Text onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
            Regístrate
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#4C1F99',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#4C1F99',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#4C1F99',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 10,
    paddingLeft: 15,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#4C1F99',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  registerText: {
    color: '#4C1F99',
    textAlign: 'center',
    marginTop: 20,
  },
  registerLink: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
