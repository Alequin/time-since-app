import ReactNativeDateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";
import { Button } from "../button";
import { newDefaultTimeItem, newTimeItem } from "../time-item-utils";
import { TimeItem } from "../time-item";
import {
  DatePickerModal,
  TimePickerModal,
} from "./components/date-time-picker-modal";

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

  const {
    startTime,
    isDatePickerVisible,
    isTimePickerVisible,
    resetTime,
    showDatePicker,
    showTimePicker,
    setDateWithDateTimePicker,
    setTimeWithDateTimePicker,
  } = useDateTimePickerState(initialTimeItem.startTime);

  const timeItem = useMemo(
    () => newTimeItem({ title: title || "Unnamed", startTime }),
    [title, startTime]
  );

  return (
    <View testID={testID} style={{ flex: 1, width: "100%" }}>
      <TimeItem item={timeItem} currentTime={currentTime} />
      <TextInput
        style={{ width: "50%", height: 40, backgroundColor: "white" }}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <Text>{startTime.toString()}</Text>
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={showDatePicker}
      >
        <Text>Change Date</Text>
      </Button>
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={showTimePicker}
      >
        <Text>Change Time</Text>
      </Button>
      <DatePickerModal
        value={startTime}
        isOpen={isDatePickerVisible}
        onChange={setDateWithDateTimePicker}
      />
      <TimePickerModal
        value={startTime}
        isOpen={isTimePickerVisible}
        onChange={setTimeWithDateTimePicker}
      />
      <Button
        style={{ padding: 10, backgroundColor: "cyan", margin: 5 }}
        onPress={resetTime}
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
        <Text>Go back</Text>
      </Button>
    </View>
  );
};

const useDateTimePickerState = (initialStartTime) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  return {
    startTime,
    isDatePickerVisible,
    isTimePickerVisible,
    showDatePicker: () => setIsDatePickerVisible(true),
    showTimePicker: () => setIsTimePickerVisible(true),
    resetTime: () => setStartTime(new Date()),
    setDateWithDateTimePicker: useCallback(
      ({ nativeEvent: { timestamp: selectedDate } }) => {
        setStartTime((previousStartDate) => {
          const newStartDate = new Date(previousStartDate);
          newStartDate.setFullYear(selectedDate.getFullYear());
          newStartDate.setMonth(selectedDate.getMonth());
          newStartDate.setDate(selectedDate.getDate());
          return newStartDate;
        });
        setIsDatePickerVisible(false);
      },
      []
    ),
    setTimeWithDateTimePicker: useCallback(
      ({ nativeEvent: { timestamp: selectedTime } }) => {
        setStartTime((previousStartTime) => {
          const newStartTime = new Date(previousStartTime);
          newStartTime.setHours(selectedTime.getHours());
          newStartTime.setMinutes(selectedTime.getMinutes());
          newStartTime.setSeconds(selectedTime.getSeconds());
          return newStartTime;
        });
        setIsTimePickerVisible(false);
      },
      []
    ),
  };
};
