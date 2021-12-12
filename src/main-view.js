import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "./button";
import { getTimeSince } from "./get-time-since";
import { Icon } from "./icons";

export const MainView = () => {
  const currentTime = useCurrentTime();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", padding: 20 }}>
      <View style={{ flex: 1, width: "100%" }}>
        <TimeItem currentTime={currentTime} />
      </View>
      <AddButton />
    </View>
  );
};

const TimeItem = ({ currentTime }) => {
  const { days, hours, minutes, seconds } = getTimeSince(
    new Date("2021-12-12T19:00:00"),
    currentTime
  );

  return (
    <View
      style={[
        {
          backgroundColor: "#D0F4DE",
          width: "100%",
          height: 100,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        },
        styles.shadow,
      ]}
    >
      <Text style={{ fontSize: 18 }}>{`Time since visiting the store`}</Text>
      <Text style={{ fontSize: 17 }}>{`Total Days: ${days}`}</Text>
      <Text style={{ fontSize: 17 }}>{`${asTwoDigitNumber(hours)}:${asTwoDigitNumber(
        minutes
      )}:${asTwoDigitNumber(seconds)}`}</Text>
    </View>
  );
};

const asTwoDigitNumber = (number) => {
  return number.toString().length === 1 ? `0${number}` : number;
};

const AddButton = () => {
  return (
    <Button
      onPress={() => {}}
      style={[
        {
          backgroundColor: "orange",
          justifyContent: "center",
          alignItems: "center",
          width: 75,
          height: 75,
          borderRadius: 1000,
        },
        styles.shadow,
      ]}
    >
      <Icon name="plus" size={40} />
    </Button>
  );
};

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 10,
  },
});
