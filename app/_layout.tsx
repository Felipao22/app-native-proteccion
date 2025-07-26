import { Stack } from "expo-router";
import { store } from "../store/index";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
