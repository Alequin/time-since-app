import React from "react";
import { View } from "react-native";
import { Button } from "./button";
import { Icon } from "./icons";

export const MainView = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", padding: 20 }}>
      <Button
        onPress={() => {}}
        style={{
          backgroundColor: "orange",
          justifyContent: "center",
          alignItems: "center",
          width: 75,
          height: 75,
          borderRadius: 50,
        }}
      >
        <Icon name="plus" size={40} />
      </Button>
    </View>
  );
};
