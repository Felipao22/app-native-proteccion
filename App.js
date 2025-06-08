import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Main from "./components/Main";
import { Provider } from "react-redux";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Main />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
