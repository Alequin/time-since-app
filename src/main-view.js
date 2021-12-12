import React from "react";
import { View, Text } from "react-native";
import { Button } from "./button";
import { getTimeSince } from "./get-time-since";
import { Icon } from "./icons";

export const MainView = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", padding: 20 }}>
      <TimeItem />
      <AddButton />
    </View>
  );
};

const TimeItem = () => {
  const { days, hours, minutes, seconds } = getTimeSince(new Date("2021-01-01T00:00:00"));

  return (
    <View>
      <Text>{`${days} ${hours} ${minutes} ${seconds}`}</Text>
    </View>
  );
};

const AddButton = () => {
  return (
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
  );
};
