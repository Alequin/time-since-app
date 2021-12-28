import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";
import { Button } from "../button";

export const NewTimeItemView = ({ toHomeView, addTimeItem }) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        toHomeView();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  const [title, setTitle] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());

  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <TextInput
        style={{ width: "50%", height: 40, backgroundColor: "white" }}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <Text>{`${startTime}`}</Text>
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{`Add Date`}</Text>
      </Button>
      {showDatePicker && (
        <DatePicker
          value={startTime}
          onChange={({ nativeEvent }) => {
            const selectedTime = nativeEvent.timestamp;
            setStartTime((previousStartTime) => {
              const newStartTime = new Date(previousStartTime);
              newStartTime.setFullYear(selectedTime.getFullYear());
              newStartTime.setMonth(selectedTime.getMonth());
              newStartTime.setDate(selectedTime.getDate());
              return newStartTime;
            });
            setShowDatePicker(false);
          }}
        />
      )}

      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{`Add Time`}</Text>
      </Button>
      {showTimePicker && (
        <TimePicker
          value={startTime}
          onChange={({ nativeEvent }) => {
            const selectedTime = nativeEvent.timestamp;
            setStartTime((previousStartTime) => {
              const newStartTime = new Date(previousStartTime);
              newStartTime.setHours(selectedTime.getHours());
              newStartTime.setMinutes(selectedTime.getMinutes());
              newStartTime.setSeconds(selectedTime.getSeconds());
              return newStartTime;
            });
            setShowTimePicker(false);
          }}
        />
      )}
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={() => {
          addTimeItem({ title, startTime });
          toHomeView();
        }}
      >
        <Text>Submit</Text>
      </Button>
    </View>
  );
};

const DatePicker = ({ value, onChange }) => {
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      mode="date"
      display="default"
      on
    />
  );
};

const TimePicker = ({ value, onChange }) => {
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      mode="time"
      display="default"
    />
  );
};
