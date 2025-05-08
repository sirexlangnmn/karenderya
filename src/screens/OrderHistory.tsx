import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const ORDERS_API = 'http://localhost:3001/orders';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(ORDERS_API);
    setOrders(res.data);
  };

  const renderOrder = ({ item, index }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.orderTitle}>🧾 Order #{index + 1}</Text>
        {Object.entries(item.items).map(([name, qty]) => (
          <Text key={name} style={styles.itemText}>
            🍲 {name} — Qty: {qty}
          </Text>
        ))}
        <Text style={styles.total}>💰 Total: ₱{item.totals}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📜 Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrder}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#4CAF50',
  },
});
