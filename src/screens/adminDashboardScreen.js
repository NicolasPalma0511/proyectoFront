import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AdminDashboardScreen = ({ navigation }) => {
  const [envios, setEnvios] = useState([]);
  const [selectedEnvioId, setSelectedEnvioId] = useState(null);
  const [estado, setEstado] = useState('pendiente'); // Estado inicial

  useEffect(() => {
    fetchEnvios();
  }, []);

  const fetchEnvios = async () => {
    try {
      const response = await api.get('/envios');
      setEnvios(response.data);
    } catch (error) {
      console.error('Error fetching envios:', error);
    }
  };

  const handleDeleteEnvio = async (envioId) => {
    try {
      await api.delete(`/envios/${envioId}`);
      fetchEnvios(); // Refrescar la lista después de eliminar
      Alert.alert('Éxito', 'Envío eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting envio:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el envío.');
    }
  };

  const handleUpdateEstado = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.patch(`/envios/${selectedEnvioId}/estado`, { estado }, {
        headers: {
          'x-auth-token': token,
        },
      });

      console.log('Estado actualizado exitosamente:', response.data);
      Alert.alert('Éxito', 'Estado actualizado exitosamente');
      setSelectedEnvioId(null);
      setEstado('pendiente'); // Restablecer el estado después de actualizar
      fetchEnvios();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el estado.');
    }
  };

  const renderEnvioItem = ({ item }) => (
    <View style={styles.envioItem}>
      <Text style={styles.label}>Nombre: {item.nombre}</Text>
      <Text style={styles.label}>Descripción: {item.descripcion}</Text>
      <Text style={styles.label}>Destino: {item.destino}</Text>
      <Text style={styles.label}>Toneladas: {item.toneladas}</Text>
      <Text style={styles.label}>Estado: {item.estado}</Text>
      <Text style={styles.label}>Precio: {item.precio}</Text>
      <Text style={styles.label}>Fecha de Creación: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteEnvio(item._id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={() => setSelectedEnvioId(item._id)}>
          <Text style={styles.buttonText}>Actualizar Estado</Text>
        </TouchableOpacity>
      </View>
      {selectedEnvioId === item._id && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={estado}
            style={styles.picker}
            onValueChange={(itemValue) => setEstado(itemValue)}
          >
            <Picker.Item label="Pendiente" value="pendiente" />
            <Picker.Item label="Enviado" value="enviado" />
            <Picker.Item label="En camino" value="en camino" />
            <Picker.Item label="Entregado" value="entregado" />
            <Picker.Item label="Cancelado" value="cancelado" />
          </Picker>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleUpdateEstado}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { setSelectedEnvioId(null); setEstado('pendiente'); }}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Listado de Envíos</Text>
      <FlatList
        data={envios}
        renderItem={renderEnvioItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }} // Ajuste para asegurar que se vean todos los elementos
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  envioItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginTop: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#FF5722',
  },
  deleteButton: {
    backgroundColor: '#FF1744',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
});

export default AdminDashboardScreen;
