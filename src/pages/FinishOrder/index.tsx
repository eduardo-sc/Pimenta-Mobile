import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPromsList } from "../../routes/app.routes";
import { api } from "../../services/api";
type RouteDetailProps = {
  FinishOrder: {
    number: string | number;
    order_id: string;
    totalPrice: string | number;
  };
};
type FinishOrderProp = RouteProp<RouteDetailProps, "FinishOrder">;

export function FinishOrder() {
  const navigation = useNavigation<NativeStackNavigationProp<StackPromsList>>();
  const route = useRoute<FinishOrderProp>();
  async function hendleFinish() {
    await api
      .put("order/make", {
        ordem_id: route.params?.order_id,
      })
      .then(() => {
        navigation.popToTop();
      })
      .catch((error) => {
        console.log(error + "Erro no envio do pedido");
      });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.alert}>Você deseja finalizar esse pedido</Text>
      <Text style={styles.title}>Mesa {route.params?.number}</Text>
      <Text style={styles.title}>Total {route.params?.totalPrice}</Text>

      <TouchableOpacity style={styles.button} onPress={hendleFinish}>
        <Text style={styles.textButton}>Finalizar Pedido</Text>
        <Feather name="shopping-cart" size={23} color="#1d1d2e" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingHorizontal: "5%",
    paddingVertical: "4%",
    justifyContent: "center",
    alignItems: "center",
  },
  alert: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3fffa3",
    flexDirection: "row",
    width: "65%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  textButton: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: "bold",
    color: "#1d1d2e",
  },
});
