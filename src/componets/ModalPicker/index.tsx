import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { CategoryProps, ItensProps } from "../../pages/Order";
interface modalPickerProps {
  options: CategoryProps[] | ItensProps[];
  handleCloseModal: () => void;
  selectItem: (item: CategoryProps) => void;
}
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
export function ModalPicker({
  options,
  handleCloseModal,
  selectItem,
}: modalPickerProps) {
  function onPressItem(item: CategoryProps) {
    selectItem(item);
    handleCloseModal();
  }

  const option = options.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.options}
      onPress={() => onPressItem(item)}
    >
      <Text style={styles.item}>{item?.name}</Text>
      {item?.price && <Text style={styles.item}>R$ {parseFloat(item?.price).toFixed(2).replace('.',',')}</Text>}
    </TouchableOpacity>
  ));
  return (
    <TouchableOpacity style={styles.container} onPress={handleCloseModal}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: WIDTH - 20,
    height: HEIGHT / 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8a8a8a",
    borderRadius: 4,
  },
  options: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.9,
    borderTopColor: "#8a8a8a",
    alignItems: Platform.OS === "web" ? "center" : "flex-start",
  },
  item: {
    margin: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: "#101026",
    justifyContent: "space-between",
  },
});
