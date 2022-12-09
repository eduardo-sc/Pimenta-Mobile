import React from "react";
import {
  StyleSheet,
  
  View,
  TouchableOpacity,
  Dimensions,
  
  Image
} from "react-native";
interface modalPickerProps {
  
  handleCloseModal: () => void;
  
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
export function ModalQrcode({handleCloseModal}:modalPickerProps) {

  

  function fecharModal(){
    handleCloseModal()
  }
  return (
    <TouchableOpacity style={styles.container} onPress={fecharModal}>
      <View style={styles.content}>
         <Image style={styles.content} source={{uri:'https://teste-rs.herokuapp.com/menu'}}/>
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
});
