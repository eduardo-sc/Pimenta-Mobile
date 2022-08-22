import React, { useState, useContext } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
export default function SignIn() {
  const [email, setEmail] = useState("eduardo@gmail.com");
  const [password, setPassword] = useState("111111");
  const { signIn, loadAuth } = useContext(AuthContext);
  async function handleLogin() {
    if (email === "" || password === "") {
      return;
    }

    await signIn({ email, password });
  }
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo2.png")} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu Email"
          placeholderTextColor={"#f0f0f0"}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua Senha"
          placeholderTextColor={"#f0f0f0"}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loadAuth ? (
            <ActivityIndicator size={25} color={"#fff"} />
          ) : (
            <Text style={styles.textButton}>Acessar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d1d2e",
  },
  logo: {
    marginBottom: 18,
  },
  inputContainer: {
    width: "95%",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 14,
  },
  input: {
    width: "95%",
    height: 40,
    backgroundColor: "#101026",
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: "#fff",
  },
  button: {
    width: "95%",
    height: 40,
    backgroundColor: "#3fffa3",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "#101026",
    fontSize: 18,
    fontWeight: "bold",
  },
});
