import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import api from '../services/api';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario y contraseña.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/register', { username, password });
      setLoading(false);
      Alert.alert('Registro Exitoso', 'Usuario registrado correctamente.');
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message || 'Error al registrar usuario.');
      } else {
        Alert.alert('Error', 'Hubo un problema al registrar el usuario. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <ImageBackground source={require('../../assets/background.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>GLOMA Portal Cliente</Text>
        <Text style={styles.subtitle}>Regístrate</Text>
        <Text style={styles.description}>Empecemos nuestra ruta juntos</Text>
        <TextInput
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />}
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Text onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            Inicia sesión
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
  loadingIndicator: {
    marginTop: 20,
  },
  loginText: {
    color: '#4C1F99',
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
