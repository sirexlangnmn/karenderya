import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './src/screens/MenuScreen';
import OrderScreen from './src/screens/OrderScreen';
import OrderHistory from './src/screens/OrderHistory';

export type RootStackParamList = {
  Menu: undefined;
  'Create Order': undefined;
  'Order History': undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Create Order" component={OrderScreen} />
        <Stack.Screen name="Order History" component={OrderHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
