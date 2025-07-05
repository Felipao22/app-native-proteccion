// import {
//   Button,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { usePosLoginMutation } from "../services/loginApi";
// import { useState } from "react";

// export default function Main() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   //Mutation Redux
//   const [login, { isLoading }] = usePosLoginMutation();

//   const handleSubmit = async () => {
//     try {
//       debugger;
//       const data = {
//         email: email,
//         password: password,
//       };
//       const response = await login(data).unwrap();
//       if (response) {
//         alert(response.message);
//       }
//     } catch (error) {
//       console.error("Error al iniciar sesión", error);
//     }
//   };

//   return (
//     <View>
//       <Text>Iniciar sesión</Text>
//       <TextInput placeholder="Usuario" value={email} onChangeText={setEmail} />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button
//         title={isLoading ? "Cargando..." : "Iniciar sesión"}
//         onPress={handleSubmit}
//         disabled={isLoading}
//       ></Button>
//       {/* <Pressable
//         onPress={handleSubmit}
//         style={{
//           width: 100,
//           height: 100,
//           backgroundColor: "blue",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text style={{ color: "white" }}>Iniciar sesión</Text>
//       </Pressable> */}
//     </View>
//   );
// }

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { usePosLoginMutation } from "../services/loginApi";

export default function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = usePosLoginMutation();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const data = { email, password };
      const response = await login(data).unwrap();

      if (response) {
        await AsyncStorage.setItem("userToken", response.token);
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));

        Alert.alert("Éxito", response.message);
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Credenciales inválidas o error en el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={isLoading ? "Cargando..." : "Iniciar sesión"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
});
