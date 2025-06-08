import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { usePosLoginMutation } from "../services/loginApi";
import { useState } from "react";

export default function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Mutation Redux
  const [login, { isLoading }] = usePosLoginMutation();

  const handleSubmit = async () => {
    try {
      debugger;
      const data = {
        email: email,
        password: password,
      };
      const response = await login(data).unwrap();
      if (response) {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <View>
      <Text>Iniciar sesión</Text>
      <TextInput placeholder="Usuario" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={isLoading ? "Cargando..." : "Iniciar sesión"}
        onPress={handleSubmit}
        disabled={isLoading}
      ></Button>
      {/* <Pressable
        onPress={handleSubmit}
        style={{
          width: 100,
          height: 100,
          backgroundColor: "blue",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Iniciar sesión</Text>
      </Pressable> */}
    </View>
  );
}
