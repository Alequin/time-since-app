import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Button } from "./button";
import { getTimeSince } from "./get-time-since";
import { Icon } from "./icons";
import { commonStyles } from "./common-styles";

export const TimeItem = ({
  item,
  currentTime,
  onPressUpdate,
  onPressDelete,
}) => {
  const { days, hours, minutes } = useMemo(
    () => getTimeSince(item.startTime, currentTime),
    [item.startTime, currentTime]
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
        commonStyles.shadow,
      ]}
    >
      <Text style={{ fontSize: 18 }}>{item.title}</Text>
      <Text style={{ fontSize: 17 }}>{`Total Days: ${days}`}</Text>
      <Text
        testID="time-item-time-string"
        style={{ fontSize: 17 }}
      >{`${asTwoDigitNumber(hours)}:${asTwoDigitNumber(minutes)}`}</Text>
      <View style={{ flexDirection: "row" }}>
        {onPressUpdate && (
          <Button
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
            onPress={() => onPressUpdate(item)}
          >
            <Icon name="edit" size={25} />
          </Button>
        )}
        {onPressDelete && (
          <Button
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
            onPress={() => onPressDelete(item)}
          >
            <Icon name="trashBin" size={25} />
          </Button>
        )}
      </View>
    </View>
  );
};

const asTwoDigitNumber = (number) => {
  return number.toString().length === 1 ? `0${number}` : number.toString();
};
