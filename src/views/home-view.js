import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../button";
import { getTimeSince } from "../get-time-since";
import { Icon } from "../icons";
import { useCurrentTime } from "../use-current-time";

export const HomeView = ({
  testID,
  timeItems,
  onAddNewItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  const currentTime = useCurrentTime();

  return (
    <View testID={testID} style={{ flex: 1, width: "100%" }}>
      <View style={{ flex: 1, width: "100%" }}>
        {timeItems.map((item) => (
          <TimeItem
            key={item.id}
            item={item}
            currentTime={currentTime}
            onPressUpdate={onUpdateItem}
            onPressDelete={onRemoveItem}
          />
        ))}
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <AddButton onPress={onAddNewItem} />
      </View>
    </View>
  );
};

const TimeItem = ({ item, currentTime, onPressUpdate, onPressDelete }) => {
  const { days, hours, minutes, seconds } = getTimeSince(
    item.startTime,
    currentTime
  );

  return (
    <View
      testID="time-item"
      style={[
        {
          backgroundColor: "#909CC2",
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
      <Text
        testID="time-item-time-string"
        style={{ fontSize: 17 }}
      >{`${asTwoDigitNumber(hours)}:${asTwoDigitNumber(
        minutes
      )}:${asTwoDigitNumber(seconds)}`}</Text>
      <View style={{ flexDirection: "row" }}>
        <Button
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          onPress={() => onPressUpdate(item)}
        >
          <Icon name="edit" size={25} />
        </Button>
        <Button
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          onPress={() => onPressDelete(item)}
        >
          <Icon name="trashBin" size={25} />
        </Button>
      </View>
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

const styles = StyleSheet.create({
  shadow: {
    elevation: 10,
  },
});
