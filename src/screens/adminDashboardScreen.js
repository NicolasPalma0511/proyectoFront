import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { jsPDF } from 'jspdf';

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

  const generatePDF = async (envio) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait', // Orientación del documento (portrait|landscape)
        unit: 'mm', // Unidad de medida (mm|cm|in|px)
        format: 'a4', // Formato del documento
      });

      const { descripcion, destino, toneladas, estado, precio, nombreUsuario, apellidoUsuario, nmrOperacion, createdAt } = envio;
      const formattedDate = new Date(createdAt).toLocaleDateString();

      // Set up the header
      doc.setFontSize(20);
      doc.setFont('times', 'bold');
      doc.text('Corporación GLOMA', 105, 20, null, null, 'center');

      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      doc.text(`Fecha de Generación: ${formattedDate}`, 105, 30, null, null, 'center');

      // Set up the title
      doc.setFontSize(16);
      doc.setFont('times', 'bold');
      doc.text('Detalles del Envío', 105, 50, null, null, 'center');

      // Draw a line below the title
      doc.setLineWidth(0.5);
      doc.line(20, 55, 190, 55);

      // Set up the table content
      const startX = 20;
      const startY = 65;
      const lineHeight = 10;

      const fields = [
        { label: 'Descripción', value: descripcion },
        { label: 'Destino', value: destino },
        { label: 'Toneladas', value: String(toneladas) }, // Convert to string
        { label: 'Estado', value: estado },
        { label: 'Precio', value: String(precio) }, // Convert to string
        { label: 'Nombre Usuario', value: nombreUsuario },
        { label: 'Apellido Usuario', value: apellidoUsuario },
        { label: 'Número de Operación', value: nmrOperacion },
      ];

      doc.setFontSize(12);
      doc.setFont('times', 'normal');

      fields.forEach((field, index) => {
        const yPosition = startY + index * lineHeight;
        doc.text(field.label, startX, yPosition);
        doc.text(field.value, startX + 60, yPosition);
        doc.line(startX, yPosition + 3, 190, yPosition + 3); // Draw line below text
      });

      // Add a footer
      doc.setFontSize(10);
      doc.text('Gracias por confiar en Corporación GLOMA', 105, 290, null, null, 'center');
      doc.text('www.gloma.com', 105, 295, null, null, 'center');

      doc.save(`envio_${envio._id}_report.pdf`);
      Alert.alert('Éxito', 'PDF generado correctamente');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('Error', 'Hubo un problema al generar el PDF.');
    }
  };

  const renderEnvioItem = ({ item }) => (
    <View style={styles.envioItem}>
      <Text style={styles.label}>Descripción: {item.descripcion}</Text>
      <Text style={styles.label}>Destino: {item.destino}</Text>
      <Text style={styles.label}>Toneladas: {item.toneladas}</Text>
      <Text style={styles.label}>Estado: {item.estado}</Text>
      <Text style={styles.label}>Precio: {item.precio}</Text>
      <Text style={styles.label}>Nombre Usuario: {item.nombreUsuario}</Text>
      <Text style={styles.label}>Apellido Usuario: {item.apellidoUsuario}</Text>
      <Text style={styles.label}>Número de Operación: {item.nmrOperacion}</Text>
      <Text style={styles.label}>Fecha de Creación: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteEnvio(item._id)}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={() => setSelectedEnvioId(item._id)}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>Actualizar Estado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.pdfButton]} onPress={() => generatePDF(item)}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>Generar PDF</Text>
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
              <Text style={[styles.buttonText, { color: '#fff' }]}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setSelectedEnvioId(null);
                setEstado('pendiente');
              }}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/logo.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Listado de Envíos</Text>
        <FlatList
          data={envios}
          renderItem={renderEnvioItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 20 }} // Ajuste para asegurar que se vean todos los elementos
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco difuminado
    paddingHorizontal: 16,
    paddingTop: 60, // Espacio para evitar que el título se superponga con la barra de estado
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
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
    width: '100%', // Ocupa todo el ancho disponible
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007BFF',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  },
  updateButton: {
    backgroundColor: '#28A745',
  },
  pdfButton: {
    backgroundColor: '#007BFF',
  },
  pickerContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#28A745',
  },
  cancelButton: {
    backgroundColor: '#DC3545',
  },
});

export default AdminDashboardScreen;
