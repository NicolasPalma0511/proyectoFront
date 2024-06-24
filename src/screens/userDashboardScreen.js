import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar la biblioteca de iconos vectoriales
import api from '../services/api';

const UserDashboardScreen = ({ navigation, route }) => {
  const [envios, setEnvios] = useState([]);

  useEffect(() => {
    fetchEnvios();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        fetchEnvios(); // Actualiza la lista de envíos
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.refresh]);

  const fetchEnvios = async () => {
    try {
      const response = await api.get('/envios');
      setEnvios(response.data);
    } catch (error) {
      console.error('Error fetching envios:', error);
    }
  };

  const navigateToEditEnvio = (envioId, estado) => {
    if (estado === 'pendiente') {
      navigation.navigate('EditEnvio', { envioId });
    } else {
      Alert.alert('No se puede editar este envío porque su estado no es pendiente.');
    }
  };

  const renderEnvioItem = ({ item }) => {
    const estados = ['pendiente', 'enviado', 'en camino', 'entregado', 'cancelado'];
    const estadoIndex = estados.indexOf(item.estado.toLowerCase());
    
    return (
      <View style={styles.envioItem}>
        <View style={styles.estadoContainer}>
          <View style={styles.linea} />
          {estados.map((e, index) => (
            <View key={index} style={styles.estadoItem}>
              <Ionicons
                name={index <= estadoIndex ? 'ios-truck' : 'ios-truck-outline'}
                size={24}
                color={index <= estadoIndex ? '#4C1F99' : '#ccc'}
              />
              <Text style={[styles.estadoText, index <= estadoIndex && styles.estadoTextLlena]}>{e}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.envioTitle}>{item.nombre}</Text>
        <Text style={styles.envioDescription}>Descripción: {item.descripcion}</Text>
        <Text style={styles.envioText}>Destino: {item.destino}</Text>
        <Text style={styles.envioText}>Estado: <Text style={{ color: item.estado === 'pendiente' ? 'green' : 'red' }}>{item.estado}</Text></Text>
        <Text style={styles.envioText}>Precio: ${item.precio}</Text>
        <TouchableOpacity
          style={[styles.button, item.estado !== 'pendiente' && styles.disabledButton]}
          onPress={() => navigateToEditEnvio(item._id, item.estado)}
          disabled={item.estado !== 'pendiente'}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de Envíos</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateEnvio')}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Crear Nuevo Envío</Text>
      </TouchableOpacity>
      <FlatList
        data={envios}
        renderItem={renderEnvioItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20, // Asegura suficiente espacio para los elementos de la lista
  },
  envioItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  linea: {
    flex: 1,
    height: 2,
    backgroundColor: '#ccc',
  },
  estadoItem: {
    alignItems: 'center',
    flex: 1,
  },
  estadoText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
  estadoTextLlena: {
    color: '#4C1F99',
  },
  envioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4C1F99',
  },
  envioDescription: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  envioText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C1F99',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserDashboardScreen;
