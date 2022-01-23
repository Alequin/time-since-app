import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Button } from "./button";
import { getTimeSince } from "./get-time-since";
import { Icon } from "./icons";
import { commonStyles } from "./common-styles";
import { wildBlueYonder } from "./colours";

export const TimeItem = ({
  item,
  currentTime,
  onPressUpdate,
  onPressDelete,
}) => {
  const { days, hours, minutes, seconds } = useMemo(
    () => getTimeSince(item.startTime, currentTime),
    [item.startTime, currentTime]
  );

  const timeUnits = useMemo(
    () => [
      { label: "Days", value: days },
      { label: "Hours", value: hours },
      { label: "Minutes", value: minutes },
      { label: "Seconds", value: seconds },
    ],
    [days, hours, minutes, seconds]
  );

  return (
    <View
      testID="time-item"
      style={[
        {
          backgroundColor: wildBlueYonder,
          width: "100%",
          height: 120,
          borderRadius: 20,
          justifyContent: "space-around",
          alignItems: "center",
          paddingVertical: 5,
          marginBottom: 15,
        },
        commonStyles.shadow,
      ]}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
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
          <TimeItemButton iconName="edit" onPress={() => onPressUpdate(item)} />
        )}
        {onPressDelete && (
          <TimeItemButton
            iconName="trashBin"
            onPress={() => onPressDelete(item)}
          />
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
      <Text style={{ fontWeight: "bold" }}>{value}</Text>
      <Text style={{ fontWeight: "bold" }}>{label}</Text>
    </View>
  );
};

const TimeItemButton = ({ onPress, iconName }) => {
  return (
    <Button
      style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
      onPress={onPress}
    >
      <Icon name={iconName} size={25} />
    </Button>
  );
};
