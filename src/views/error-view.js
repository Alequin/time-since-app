import React from "react";
import { View, Text } from "react-native";

export const ErrorView = ({ testID }) => {
  return (
    <View
      testID={testID}
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Sorry, the app has encountered an issue</Text>
    </View>
  );
};
