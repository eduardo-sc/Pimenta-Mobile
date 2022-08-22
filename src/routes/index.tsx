import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { AuthContext } from "../contexts/AuthContext";
function Routes() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1d1d2e",
        }}
      >
        <ActivityIndicator color="#ffff" size={35} />
      </View>
    );
  }
  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}
export default Routes;
