import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MainView } from "./src/main-view";

// base
// colour pallet https://coolors.co/909cc2-084887-ffa500-f7f5fb-d0f4de

// Others built from base
// https://coolors.co/909cc2-b6244f-084887-e75a7c-ffa500-f2f6d0-9df7e5-f7f5fb-cff27e-d0f4de
// https://coolors.co/909cc2-15e6cd-084887-0cf574-ffa500-bbe1c3-869d7a-f7f5fb-8b5d33-d0f4de
// https://coolors.co/909cc2-cd5334-084887-8ea604-ffa500-bf3100-69995d-f7f5fb-fe938c-d0f4de

export const App = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F7F5FB",
      }}
    >
      <StatusBar style={{ color: "black" }} backgroundColor="#F7F5FB" />
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
