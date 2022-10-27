import React, { useContext, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack/";
import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import { FinishOrder } from "../pages/FinishOrder";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export type StackPromsList = {
  Dashboard: undefined;
  Order: {
    number: number | string;
    order_id: string;
    order: boolean;
  };
  FinishOrder: {
    number: string | number;
    order_id: string;
    totalPrice: string | number;
  };
};
const Stack = createNativeStackNavigator<StackPromsList>();

function AppRoutes() {
  const { signOut } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: "",
          headerStyle: { backgroundColor: "#1d1d2e" },
          headerRight: () => (
            <TouchableOpacity onPress={() => signOut()}>
              <Feather name="log-out" size={25} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FinishOrder"
        component={FinishOrder}
        options={{
          title: "Finalizando",
          headerStyle: {
            backgroundColor: "#1d1d2e",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

export default AppRoutes;
