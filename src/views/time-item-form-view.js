import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";
import { Button, ShadowButton } from "../button";
import { wildBlueYonder } from "../colours";
import { Icon } from "../icons";
import { TimeItem } from "../time-item";
import { newDefaultTimeItem, updateTimeItem } from "../time-item-utils";
import {
  DatePickerModal,
  TimePickerModal,
} from "./components/date-time-picker-modal";

export const TimeItemFormView = ({
  testID,
  currentTime,
  timeItemToEdit,
  onPressBack,
  onSubmit,
}) => {
  const baseTimeItem = useMemo(() => {
    return timeItemToEdit ? timeItemToEdit : newDefaultTimeItem();
  }, []);

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

  const [title, setTitle] = useState(baseTimeItem.title);

  const {
    startTime,
    isDatePickerVisible,
    isTimePickerVisible,
    resetTime,
    showDatePicker,
    showTimePicker,
    setDateWithDateTimePicker,
    setTimeWithDateTimePicker,
  } = useDateTimePickerState(timeItemToEdit?.startTime);

  const timeItem = useMemo(
    () =>
      updateTimeItem(baseTimeItem, { title: title || "Unnamed", startTime }),
    [title, startTime]
  );
  return (
    <View
      testID={testID}
      style={{ flex: 1, width: "100%", alignItems: "center" }}
    >
      <TimeItem item={timeItem} currentTime={currentTime} />

      <View
        style={{
          width: "100%",
          alignItems: "center",
          padding: 5,
        }}
      >
        <TextInput
          style={{
            height: 40,
            width: "100%",
            backgroundColor: "white",
            textAlign: "center",
          }}
          placeholder="Title"
          value={title}
          onChangeText={(title) => setTitle(title)}
        />
        <Text>
          Start Time:{" "}
          {startTime.toLocaleDateString("en-gb", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              width: "50%",
            }}
          >
            <FormButton
              onPress={showDatePicker}
              iconName="calendar"
              text="Change Date"
            />
            <FormButton
              onPress={showTimePicker}
              iconName="time"
              text="Change Time"
            />
          </View>
          <View
            style={{
              width: "50%",
            }}
          >
            <FormButton
              onPress={() => {
                resetTime();
                setTitle(baseTimeItem.title);
              }}
              iconName="undo"
              text="Reset"
            />
            <FormButton
              onPress={() => onSubmit(timeItem)}
              iconName="time"
              text="Submit"
            />
          </View>
        </View>
        <FormButton
          style={{ width: 200 }}
          onPress={onPressBack}
          iconName="back"
          text="Go back"
        />
      </View>

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
    </View>
  );
};

const useDateTimePickerState = (initialStartTime) => {
  const [startTime, setStartTime] = useState(initialStartTime || new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  return {
    startTime,
    isDatePickerVisible,
    isTimePickerVisible,
    showDatePicker: () => setIsDatePickerVisible(true),
    showTimePicker: () => setIsTimePickerVisible(true),
    resetTime: () => setStartTime(initialStartTime || new Date()),
    setDateWithDateTimePicker: useCallback(({ selectedDate }) => {
      setIsDatePickerVisible(false);

      if (!selectedDate) return;
      setStartTime((previousStartDate) => {
        const newStartDate = new Date(previousStartDate);
        newStartDate.setFullYear(selectedDate.getFullYear());
        newStartDate.setMonth(selectedDate.getMonth());
        newStartDate.setDate(selectedDate.getDate());
        return newStartDate;
      });
    }, []),
    setTimeWithDateTimePicker: useCallback(({ selectedDate }) => {
      setIsTimePickerVisible(false);

      if (!selectedDate) return;
      setStartTime((previousStartTime) => {
        const newStartTime = new Date(previousStartTime);
        newStartTime.setHours(selectedDate.getHours());
        newStartTime.setMinutes(selectedDate.getMinutes());
        newStartTime.setSeconds(selectedDate.getSeconds());
        return newStartTime;
      });
    }, []),
  };
};

const FormButton = ({ onPress, iconName, style, text }) => {
  return (
    <ShadowButton
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: wildBlueYonder,
          margin: 5,
          borderRadius: 10,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Icon
        style={{ width: "15%", alignItems: "center" }}
        name={iconName}
        size={22}
      />
      <Text
        style={{
          width: "70%",
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </ShadowButton>
  );
};

const formatDate = (date) => {};
