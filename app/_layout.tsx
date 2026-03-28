import { Stack } from "expo-router";
import { store } from "../store/index";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
