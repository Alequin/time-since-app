import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";
import { Button } from "../button";

const newDefaultTimeItem = () => ({
  title: "",
  startTime: new Date(),
});

export const TimeItemFormView = ({
  initialTimeItem = newDefaultTimeItem(),
  onPressBack,
  onSubmit,
}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onPressBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  const [title, setTitle] = useState(initialTimeItem.title);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(initialTimeItem.startTime);
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
            const selectedDate = nativeEvent.timestamp;
            setStartTime((previousStartDate) => {
              if (!selectedDate) return previousStartDate;

              const newStartDate = new Date(previousStartDate);
              newStartDate.setFullYear(selectedDate.getFullYear());
              newStartDate.setMonth(selectedDate.getMonth());
              newStartDate.setDate(selectedDate.getDate());
              return newStartDate;
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
              if (!selectedTime) return previousStartTime;

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
        onPress={() => setStartTime(new Date())}
      >
        <Text>Set time to right now</Text>
      </Button>
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={() => onSubmit({ title, startTime })}
      >
        <Text>Submit</Text>
      </Button>
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={onPressBack}
      >
        <Text>Cancel</Text>
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
