import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://localhost:3001/menu';

export default function MenuScreen() {
  const navigation = useNavigation();
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>🍴 Karenderya Menu Manager</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>➕ Add New Menu Item</Text>
          <TextInput
            placeholder="Food name (e.g., Adobo)"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Price (e.g., 70)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Available Quantity (e.g., 10)"
            value={qty}
            onChangeText={setQty}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={addItem}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>📋 Menu List</Text>
        <FlatList
          data={menu}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDetails}>
                ₱{item.price} | Qty: {item.availableOrderQty}
              </Text>
            </View>
          )}
        />
      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Order')}
        >
          <Text style={styles.navButtonText}>➕ Place Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.navButtonText}>📜 Order History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  list: { paddingBottom: 40 },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodName: { fontWeight: 'bold', fontSize: 16 },
  foodDetails: { color: '#555' },

  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  navButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    minWidth: 130,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
