import { Stack } from "expo-router";
import { store } from "../store/index";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </SafeAreaProvider>
  );
}
