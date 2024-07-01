import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

const CreateEnvioScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [numeroOperacion, setNumeroOperacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [destino, setDestino] = useState('Lima');
  const [toneladas, setToneladas] = useState('1');
  const [precio, setPrecio] = useState(0);
  const [error, setError] = useState('');

  const estado = 'pendiente';

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
      default:
        precioBase = 0;
    }
    const toneladasNumber = parseFloat(toneladas);
    const precioFinal = precioBase * toneladasNumber;
    return precioFinal;
  };

  const handleCreateEnvio = async () => {
    try {
      // Validar que todos los campos estén llenos
      if (!nombre || !apellidos || !dni || !numeroOperacion || !descripcion || !toneladas) {
        throw new Error('Por favor complete todos los campos');
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token');
      }

      const formData = {
        descripcion,
        destino,
        estado,
        precio: parseFloat(precio), // Asegurarse de que precio sea un número
        toneladas: parseFloat(toneladas),
        nombreUsuario: nombre,
        apellidoUsuario: apellidos,
        nmrOperacion: numeroOperacion,
      };

      const response = await api.post('/envios', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      console.log('Envío creado exitosamente:', response.data);
      Alert.alert('Éxito', 'Envío creado exitosamente');
      navigation.navigate('UserDashboard', { refresh: true });
    } catch (error) {
      console.error('Error al crear envío:', error.message);
      setError(error.message); // Guardar el mensaje de error
      Alert.alert('Error', error.message);
    }
  };

  const handleDestinoChange = (itemValue) => {
    setDestino(itemValue);
    const nuevoPrecio = calcularPrecio(itemValue, toneladas);
    setPrecio(nuevoPrecio);
  };

  const handleToneladasChange = (inputValue) => {
    setToneladas(inputValue);
    const nuevoPrecio = calcularPrecio(destino, inputValue);
    setPrecio(nuevoPrecio);
  };

  return (
    <ScrollView style={styles.container}>
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
        <Text style={styles.label}>Apellidos:</Text>
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={apellidos}
          onChangeText={setApellidos}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>DNI:</Text>
        <TextInput
          style={styles.input}
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número de Operación:</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de Operación"
          value={numeroOperacion}
          onChangeText={setNumeroOperacion}
          keyboardType="numeric"
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

      {/* Campo estático para números de cuenta */}
      <View style={styles.accountContainer}>
        <Text style={styles.accountLabel}>Número de Cuenta Interbank:</Text>
        <Text style={styles.accountText}>8983332412142</Text>
        <Text style={styles.accountLabel}>Número de CCI:</Text>
        <Text style={styles.accountText}>00389801333241214244</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Desde:</Text>
        <Picker
          style={styles.picker}
        >
          <Picker.Item label="Arequipa" value="Arequipa" />
        </Picker>
        <Text style={styles.label}>Hacia:</Text>
        <Picker
          selectedValue={destino}
          style={styles.picker}
          onValueChange={handleDestinoChange}
        >
          <Picker.Item label="Lima" value="Lima" />
          <Picker.Item label="Cusco" value="Cusco" />
          <Picker.Item label="Trujillo" value="Trujillo" />
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

      <Text style={styles.priceLabel}>Precio: S/ {precio}</Text>
      
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleCreateEnvio}>
        <Text style={styles.buttonText}>Crear Envío</Text>
      </TouchableOpacity>
      
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          El sitio www.corporacióngloma.com cuenta con licencia otorgada a favor del Ministerio de Transportes. Todos los derechos reservados. En Perú está sujeto a los términos y condiciones de este sitio.
        </Text>
        <Text style={styles.footerText}>
         Gracias por confiar en Corporación GLOMA
        </Text>
        <Text style={styles.footerText}>
          Contacto: atencionalcliente@corporacióngloma.com
        </Text>
        <Text style={styles.footerText}>
          © 2014 - 2024 corporacióngloma.com
        </Text>
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
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
    height: 40,
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
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
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
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  accountContainer: {
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  accountText: {
    fontSize: 16,
    color: '#333',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default CreateEnvioScreen;
