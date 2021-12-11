import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { MainView } from "./src/main-view";

export const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MainView />
    </View>
  );
};

const AppWindow = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <App />
    </View>
  );
};

export default () => {
  return (
    <SafeAreaProvider>
      <AppWindow />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
