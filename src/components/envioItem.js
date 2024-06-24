import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EnvioItem = ({ envio }) => {
  return (
    <View style={styles.item}>
      <Text>{envio.descripcion}</Text>
      <Text>{envio.estado}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default EnvioItem;
