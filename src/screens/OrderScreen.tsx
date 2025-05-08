import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const MENU_API = 'http://localhost:3001/menu';
const ORDERS_API = 'http://localhost:3001/orders';

export default function OrderScreen() {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await axios.get(MENU_API);
    setMenu(res.data);
  };

  const updateQty = (itemName, value, price) => {
    const qty = parseInt(value) || 0;
    const updatedOrder = { ...order, [itemName]: { qty, price } };
    setOrder(updatedOrder);

    // Recalculate total
    let newTotal = 0;
    for (let key in updatedOrder) {
      newTotal += updatedOrder[key].qty * updatedOrder[key].price;
    }
    setTotal(newTotal);
  };

  const submitOrder = async () => {
    const items = {};
    for (let key in order) {
      if (order[key].qty > 0) {
        items[key] = order[key].qty;
      }
    }

    if (Object.keys(items).length === 0) return alert('🛑 Select at least one item');

    const orderPayload = {
      items,
      totals: total,
    };

    await axios.post(ORDERS_API, orderPayload);
    alert('✅ Order placed!');
    setOrder({});
    setTotal(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🛒 Place Your Order</Text>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodPrice}>₱{item.price}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Qty"
              keyboardType="numeric"
              value={order[item.name]?.qty?.toString() || ''}
              onChangeText={(val) => updateQty(item.name, val, item.price)}
            />
          </View>
        )}
      />

      <Text style={styles.total}>💰 Total: ₱{total}</Text>

      <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
        <Text style={styles.submitButtonText}>✅ Submit Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
  },
  foodPrice: {
    fontSize: 14,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
