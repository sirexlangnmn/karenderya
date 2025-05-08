import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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

    if (Object.keys(items).length === 0) return alert('Select at least one item');

    const orderPayload = {
      items,
      totals: total,
    };

    await axios.post(ORDERS_API, orderPayload);
    alert('Order placed!');
    setOrder({});
    setTotal(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Place an Order</Text>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodPrice}>₱{item.price}</Text>
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

      <Text style={styles.total}>Total: ₱{total}</Text>

      <TouchableOpacity style={styles.button} onPress={submitOrder}>
        <Text style={styles.buttonText}>✅ Submit Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  menuItem: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  foodName: { fontSize: 16, fontWeight: 'bold' },
  foodPrice: { fontSize: 14, color: '#666' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
    padding: 8,
    borderRadius: 5,
    width: 80,
  },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  button: {
    backgroundColor: '#4CAF50',
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
