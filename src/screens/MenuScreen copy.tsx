// import React from 'react';
// import { View, Text } from 'react-native';

// export default function MenuScreen() {
//   return (
//     <View>
//       <Text>🍽️ Menu Screen</Text>
//     </View>
//   );
// }



import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:3001/menu';

export default function MenuScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await axios.get(API_URL);
    setMenu(res.data);
  };

  const addItem = async () => {
    if (!name || !price || !qty) return;
    await axios.post(API_URL, {
      name,
      price: parseFloat(price),
      availableOrderQty: parseInt(qty),
    });
    setName('');
    setPrice('');
    setQty('');
    fetchMenu();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Add Food Item</Text>
      <TextInput placeholder="Food name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Qty" value={qty} onChangeText={setQty} keyboardType="numeric" style={styles.input} />
      <Button title="Add Item" onPress={addItem} />

      <Text style={styles.title}>📋 Current Menu</Text>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} — ₱{item.price} (Qty: {item.availableOrderQty})</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontWeight: 'bold', marginTop: 20, fontSize: 18 },
  input: { borderWidth: 1, padding: 8, marginVertical: 5 },
});
