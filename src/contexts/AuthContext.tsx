import React, { useState, createContext, ReactNode, useEffect } from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
("@react-native-async-storage/async-storage");
type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (creantials: SigInProps) => Promise<void>;
  loadAuth: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  tokem: string;
};
type AuthProviderProps = {
  children: ReactNode;
};
type SigInProps = {
  email: string;
  password: string;
};
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    tokem: "",
  });

  const isAuthenticated = !!user.name;
  const [loadAuth, setLoadAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      //pegar dados do usuario
      const userInfo = await AsyncStorage.getItem("@sujeitopizzaria");
      //converter string em objeto
      let hasUser: UserProps = JSON.parse(userInfo || "{}");
      //verificar se recebeu objeto
      if (Object.keys(hasUser).length > 0) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${hasUser.tokem}`;
        setUser({
          id: hasUser.id,
          name: hasUser.name,
          email: hasUser.email,
          tokem: hasUser.tokem,
        });
      }
      setLoading(false);
    }

    getUser();
  }, []);
  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser({
        name: "",
        id: "",
        email: "",
        tokem: "",
      });
    });
    setLoadAuth(false);
  }
  async function signIn({ email, password }: SigInProps) {
    setLoadAuth(true);
    try {
      const response = await api.post("/session/collaborator", {
        email,
        password,
      });

      const { id, name, tokem } = response.data;
      const data = {
        ...response.data,
      };
      await AsyncStorage.setItem("@sujeitopizzaria", JSON.stringify(data));

      api.defaults.headers.common["Authorization"] = `Bearer ${tokem}`;
      setUser({
        id,
        name,
        email,
        tokem,
      });
      console.log(response.data);
    } catch (error) {
      Alert.alert("Sem acesso", error.response.data.error);
      setLoadAuth(false);
    }
  }
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, loadAuth, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
