import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";
import { Button } from "../button";
import { newDefaultTimeItem, newTimeItem } from "../new-time-item";
import { TimeItem } from "../time-item";

export const TimeItemFormView = ({
  testID,
  currentTime,
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
  const [startTime, setStartTime] = useState(initialTimeItem.startTime);
  const timeItem = useMemo(
    () => newTimeItem({ title: title || "Unnamed", startTime }),
    [title, startTime]
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View testID={testID} style={{ flex: 1, width: "100%" }}>
      <TimeItem item={timeItem} currentTime={currentTime} />
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
        <Text>Change Date</Text>
      </Button>
      <DatePicker
        value={startTime}
        isOpen={showDatePicker}
        onChange={useCallback(
          ({ nativeEvent: { timestamp: selectedDate } }) => {
            setStartTime((previousStartDate) => {
              const newStartDate = new Date(previousStartDate);
              newStartDate.setFullYear(selectedDate.getFullYear());
              newStartDate.setMonth(selectedDate.getMonth());
              newStartDate.setDate(selectedDate.getDate());
              return newStartDate;
            });
            setShowDatePicker(false);
          },
          []
        )}
      />
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>Change Time</Text>
      </Button>
      <TimePicker
        value={startTime}
        isOpen={showTimePicker}
        onChange={useCallback(
          ({ nativeEvent: { timestamp: selectedTime } }) => {
            setStartTime((previousStartTime) => {
              const newStartTime = new Date(previousStartTime);
              newStartTime.setHours(selectedTime.getHours());
              newStartTime.setMinutes(selectedTime.getMinutes());
              newStartTime.setSeconds(selectedTime.getSeconds());
              return newStartTime;
            });
            setShowTimePicker(false);
          },
          []
        )}
      />
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={() => setStartTime(new Date())}
      >
        <Text>Set time to right now</Text>
      </Button>
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={() => onSubmit(timeItem)}
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

const DatePicker = ({ isOpen, value, onChange }) => {
  return useMemo(
    () =>
      isOpen && (
        <DateTimePicker
          testID="date-picker"
          value={value}
          onChange={onChange}
          mode="date"
          display="default"
        />
      ),
    [isOpen, value, onChange]
  );
};

const TimePicker = ({ isOpen, value, onChange }) => {
  return useMemo(
    () =>
      isOpen && (
        <DateTimePicker
          testID="time-picker"
          value={value}
          onChange={onChange}
          mode="time"
          display="default"
        />
      ),
    [isOpen, value, onChange]
  );
};
