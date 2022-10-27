import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { api } from "../../services/api";
import { StackPromsList } from "../../routes/app.routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function Dashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<StackPromsList>>();
  const [number, setNumber] = useState("");

  async function openOrder() {
    if (number === "") {
      return;
    }
    await api
      .post("/order", {
        table: Number(number),
      })
      .then((response) => {
        console.log(response.data);
        //preciso fazer uma requisicao e abrir a mesa e navegar para proxima tela
        navigation.navigate("Order", {
          number: number,
          order_id: response.data.id,
          order: response.data.order,
        });
      })
      .catch((erro) => {
        console.log(erro);
      });
    setNumber("");
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Novo Pedido</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        placeholder="Numero da mesa"
        placeholderTextColor="#f0f0f0"
        value={number}
        onChangeText={setNumber}
      />
      <TouchableOpacity style={styles.button} onPress={openOrder}>
        <Text style={styles.buttonText}>Abrir Mesa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#1d1d2e",
  },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff", marginBottom: 24 },
  button: {
    width: "90%",
    height: 40,
    backgroundColor: "#3fffa3",
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#101026",
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    height: 60,
    backgroundColor: "#101026",
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: "center",
    color: "#fff",
  },
});
