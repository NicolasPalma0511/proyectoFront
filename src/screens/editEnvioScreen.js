import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const EditEnvioScreen = ({ navigation, route }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    loadEnvio(); // Carga los datos del envío al iniciar el componente
  }, []);

  const loadEnvio = async () => {
    try {
      setLoading(true); // Inicia la carga

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get(`/envios/${route.params.envioId}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      const { nombre, descripcion } = response.data;
      setNombre(nombre);
      setDescripcion(descripcion);
    } catch (error) {
      console.error('Error fetching envío:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los detalles del envío.');
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  const handleUpdateEnvio = async () => {
    try {
      setLoading(true); // Inicia la carga
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await api.patch(`/envios/${route.params.envioId}`, {
        nombre,
        descripcion,
      }, {
        headers: {
          'x-auth-token': token,
        },
      });
  
      console.log('Envío actualizado exitosamente:', response.data);
      Alert.alert('Éxito', 'Envío actualizado exitosamente');
      navigation.navigate('UserDashboard', { refresh: true }); // Aquí es crucial enviar el parámetro refresh
    } catch (error) {
      console.error('Error updating envío:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el envío.');
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el nombre"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Ingrese la descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdateEnvio}>
        <Text style={styles.buttonText}>Actualizar Envío</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  descriptionInput: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditEnvioScreen;
