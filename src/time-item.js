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

  const timeUnits = useMemo(
    () => [
      { label: "Days", value: days },
      { label: "Hours", value: hours },
      { label: "Minutes", value: minutes },
    ],
    [days, hours, minutes]
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
      <View
        style={{
          width: "60%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {timeUnits.map(({ label, value }) => (
          <TimeUnit key={label} label={label} value={value} />
        ))}
      </View>
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

const TimeUnit = ({ value, label }) => {
  return (
    <View
      testID={`${label}-unit`}
      style={{
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 17 }}>{value}</Text>
      <Text style={{ fontSize: 17 }}>{label}</Text>
    </View>
  );
};
