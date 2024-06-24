import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

const CreateEnvioScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [destino, setDestino] = useState('Lima'); // Destino inicial: Lima
  const [toneladas, setToneladas] = useState('1'); // Toneladas iniciales: 1
  const [precio, setPrecio] = useState(0); // Estado para almacenar el precio

  const estado = 'pendiente'; // Estado fijo: pendiente

  // Función para calcular el precio basado en el destino y las toneladas
  const calcularPrecio = (destino, toneladas) => {
    let precioBase = 0;
    switch (destino) {
      case 'Lima':
        precioBase = 50;
        break;
      case 'Cusco':
        precioBase = 100;
        break;
      case 'Trujillo':
        precioBase = 75;
        break;
      case 'Arequipa':
        precioBase = 120;
        break;
      default:
        precioBase = 0;
    }

    // Convertir las toneladas a número y calcular el precio
    const toneladasNumber = parseFloat(toneladas);
    const precioFinal = precioBase * toneladasNumber;
    return precioFinal;
  };

  // Función para manejar la creación del envío
  const handleCreateEnvio = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token');
      }

      const response = await api.post('/envios', { 
        nombre,
        descripcion,
        destino,
        estado,
        precio,
        toneladas: parseFloat(toneladas), // Convertir las toneladas a número antes de enviar
      }, {
        headers: {
          'x-auth-token': token,
        },
      });

      console.log('Envío creado exitosamente:', response.data);
      Alert.alert('Éxito', 'Envío creado exitosamente');
      navigation.navigate('UserDashboard', { refresh: true }); // Navegar de vuelta y enviar la señal de actualización
    } catch (error) {
      console.error('Error al crear envío:', error);
      if (error.response) {
        console.error('Datos de respuesta:', error.response.data);
        console.error('Estado de respuesta:', error.response.status);
        console.error('Encabezados de respuesta:', error.response.headers);
      }
      Alert.alert('Error', 'Hubo un problema al crear el envío.');
    }
  };

  // Función para actualizar el precio cuando cambia el destino o las toneladas
  const handleDestinoChange = (itemValue) => {
    setDestino(itemValue);
    const nuevoPrecio = calcularPrecio(itemValue, toneladas);
    setPrecio(nuevoPrecio);
  };

  // Función para manejar el cambio en la entrada de toneladas
  const handleToneladasChange = (inputValue) => {
    setToneladas(inputValue);
    const nuevoPrecio = calcularPrecio(destino, inputValue);
    setPrecio(nuevoPrecio);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Envío</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Desde: Arequipa</Text> {/* Texto encima de los espacios */}
        <Picker
          selectedValue={destino}
          style={styles.picker}
          onValueChange={handleDestinoChange}
        >
          <Picker.Item label="Lima" value="Lima" />
          <Picker.Item label="Cusco" value="Cusco" />
          <Picker.Item label="Trujillo" value="Trujillo" />
          <Picker.Item label="Arequipa" value="Arequipa" />
          {/* Agregar más destinos según sea necesario */}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Toneladas:</Text>
        <TextInput
          style={styles.input}
          placeholder="Toneladas"
          value={toneladas}
          onChangeText={handleToneladasChange}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.priceLabel}>Precio: S/ {precio}</Text> {/* Mostrar el precio */}
      
      <TouchableOpacity style={styles.button} onPress={handleCreateEnvio}>
        <Text style={styles.buttonText}>Crear Envío</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 8, // Espacio más corto entre los contenedores de entrada
  },
  input: {
    height: 40, // Altura del input
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  picker: {
    height: 40, // Altura del picker
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceLabel: {
    fontSize: 18,
    marginBottom: 8, // Espacio más corto para el precio
    color: '#333',
  },
  button: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
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

export default CreateEnvioScreen;
