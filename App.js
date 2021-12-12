import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { MainView } from "./src/main-view";

// colour pallet https://coolors.co/909cc2-084887-ffa500-f7f5fb-d0f4de

export const App = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#909CC2",
      }}
    >
      <StatusBar backgroundColor="#909CC2" />
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
