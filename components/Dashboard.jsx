import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePosLogOutMutation } from "../services/loginApi";

export default function Dashboard({ navigation }) {
  const [userData, setUserData] = useState(null);

  //Mutation Redux
  const [posLogOut] = usePosLogOutMutation();

  // Al montar el componente, leer datos del storage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error("Error al leer los datos del usuario", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await posLogOut().unwrap();
      await AsyncStorage.clear();
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Cargando datos del usuario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenido, {userData.name} {userData.lastName}
      </Text>
      <Text style={styles.text}>Email: {userData.email}</Text>
      <Text style={styles.text}>Admin: {userData.isAdmin ? "Sí" : "No"}</Text>
      <Text style={styles.text}>
        Super Admin: {userData.isSuperAdmin ? "Sí" : "No"}
      </Text>

      <View style={{ marginTop: 30 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: { fontSize: 16, marginBottom: 10, textAlign: "center" },
});
