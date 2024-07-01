import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const EditEnvioScreen = ({ navigation, route }) => {
  const [descripcion, setDescripcion] = useState('');
  const [toneladas, setToneladas] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEnvio();
  }, []);

  const loadEnvio = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get(`/envios/${route.params.envioId}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      const { descripcion, toneladas, precio } = response.data;
      setDescripcion(descripcion);
      setToneladas(toneladas.toString());
      setPrecio(precio.toString());
    } catch (error) {
      console.error('Error fetching envío:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los detalles del envío.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEnvio = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Calcular el precio basado en las toneladas ingresadas por el usuario
      const toneladasFloat = parseFloat(toneladas);
      const precioCalculado = toneladasFloat * 100; // Ejemplo de cálculo ficticio en el frontend

      // Actualizar el estado del precio calculado
      setPrecio(precioCalculado.toFixed(2)); // Ajustar el formato según tus necesidades

      const response = await api.patch(`/envios/${route.params.envioId}`, {
        toneladas: toneladasFloat,
        precio: precioCalculado,
      }, {
        headers: {
          'x-auth-token': token,
        },
      });

      console.log('Envío actualizado exitosamente:', response.data);
      Alert.alert('Éxito', 'Envío actualizado exitosamente');
      navigation.navigate('UserDashboard', { refresh: true });
    } catch (error) {
      console.error('Error updating envío:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el envío.');
    } finally {
      setLoading(false);
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Toneladas:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese las toneladas"
          value={toneladas}
          onChangeText={setToneladas}
          keyboardType="numeric"
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
