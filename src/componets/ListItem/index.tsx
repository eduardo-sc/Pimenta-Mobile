import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ItensProps } from "../../pages/Order";
import { Feather } from "@expo/vector-icons";
interface ItemProps {
  data: ItensProps | any;
  DeleteItem: (item_id: string) => void;
  AlterarItem: (item_id: string) => void;
}
export function ListItem({ data, DeleteItem, AlterarItem }: ItemProps) {
  function hendleDeleteItem() {
    DeleteItem(data);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textoItem}>{data.name}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 10,
        }}
      >
        <Text style={[styles.textoItem, { fontWeight: "bold" }]}>
          Quantidade : {data.amount}{" "}
        </Text>
        <Text style={styles.textoItem}>R$ {data.price}</Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 15 }}>
        <TouchableOpacity
          style={{
            width: "90%",
            height: 35,
            backgroundColor: "#ff3f4b",
            alignItems: "center",
            borderRadius: 5,
            justifyContent: "center",
          }}
          onPress={hendleDeleteItem}
        >
          <Feather name="trash-2" size={25} color="#1d1d2e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101026",
    justifyContent: "space-between",

    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 0.3,
    borderColor: "#8a8a8a",
  },
  textoItem: {
    color: "#fff",
  },
});
