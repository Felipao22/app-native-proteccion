import { Provider } from "react-redux";
import { store } from "./store";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "./components/Main";
import Dashboard from "./components/Dashboard";
import ConstanciaVisitaScreen from "./components/ConstanciaVisitaScreen";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Main} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="ConstanciaVisitaScreen"
            component={ConstanciaVisitaScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
