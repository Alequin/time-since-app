import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../button";
import { getTimeSince } from "../get-time-since";
import { Icon } from "../icons";

export const HomeView = ({ toNewTimeItemView, timeItems }) => {
  const currentTime = useCurrentTime();

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={{ flex: 1, width: "100%" }}>
        {timeItems.map((item) => (
          <TimeItem key={item.startTime.getTime()} item={item} currentTime={currentTime} />
        ))}
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <AddButton onPress={toNewTimeItemView} />
      </View>
    </View>
  );
};

const TimeItem = ({ item, currentTime }) => {
  const { days, hours, minutes, seconds } = getTimeSince(item.startTime, currentTime);

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
      <Text style={{ fontSize: 18 }}>{item.title}</Text>
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

const AddButton = ({ onPress }) => {
  return (
    <Button
      onPress={onPress}
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
