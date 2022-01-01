import React from "react";
import { View } from "react-native";
import { Button } from "../button";
import { Icon } from "../icons";
import { commonStyles } from "../common-styles";
import { TimeItem } from "../time-item";

export const HomeView = ({
  testID,
  timeItems,
  currentTime,
  onAddNewItem,
  onUpdateItem,
  onRemoveItem,
}) => {
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
        commonStyles.shadow,
      ]}
    >
      <Icon name="plus" size={40} />
    </Button>
  );
};
