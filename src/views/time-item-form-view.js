import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";
import { ShadowButton } from "../button";
import { wildBlueYonder } from "../colours";
import { dateToDisplayFormat } from "../date-to-dispay-format";
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
    hasTimeBeenReset,
    isDatePickerVisible,
    isTimePickerVisible,
    resetTime,
    showDatePicker,
    showTimePicker,
    setDateWithDateTimePicker,
    setTimeWithDateTimePicker,
  } = useDateTimePickerState(timeItemToEdit?.startTime);

  const isResetButtonDisabled = Boolean(
    baseTimeItem.title === title && hasTimeBeenReset
  );

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
        <TitleInput value={title} onChange={(title) => setTitle(title)} />
        <StartTimeDisplay startTime={startTime} />
      </View>
      <FormButtons
        onPressChangeDate={showDatePicker}
        onPressChangeTime={showTimePicker}
        isResetButtonDisabled={isResetButtonDisabled}
        onSubmit={() => onSubmit(timeItem)}
        onPressBack={onPressBack}
        onPressReset={() => {
          resetTime();
          setTitle(baseTimeItem.title);
        }}
      />
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
  const [hasTimeBeenReset, setHasTimeBeenReset] = useState(
    initialStartTime || new Date()
  );

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  return {
    startTime,
    hasTimeBeenReset,
    isDatePickerVisible,
    isTimePickerVisible,
    showDatePicker: () => setIsDatePickerVisible(true),
    showTimePicker: () => setIsTimePickerVisible(true),
    resetTime: () => {
      setStartTime(initialStartTime || new Date());
      setHasTimeBeenReset(true);
    },
    setDateWithDateTimePicker: useCallback(({ selectedDate }) => {
      setIsDatePickerVisible(false);

      if (!selectedDate) return;
      setHasTimeBeenReset(false);
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
      setHasTimeBeenReset(false);
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

const TitleInput = ({ value, onChange }) => {
  return (
    <TextInput
      style={{
        height: 40,
        width: "100%",
        backgroundColor: "white",
        textAlign: "center",
        marginBottom: 10,
      }}
      placeholder="Title"
      value={value}
      onChangeText={onChange}
    />
  );
};

const StartTimeDisplay = ({ startTime }) => {
  return (
    <View
      style={{
        backgroundColor: wildBlueYonder,
        width: "100%",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        Start Time: {useMemo(() => dateToDisplayFormat(startTime), [startTime])}
      </Text>
    </View>
  );
};

const FormButtons = ({
  onPressChangeDate,
  onPressChangeTime,
  isResetButtonDisabled,
  onSubmit,
  onPressBack,
  onPressReset,
}) => {
  return (
    <>
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
            onPress={onPressChangeDate}
            iconName="calendar"
            text="Change Date"
          />
          <FormButton
            onPress={onPressChangeTime}
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
            disabled={isResetButtonDisabled}
            onPress={onPressReset}
            iconName="undo"
            text="Reset"
          />
          <FormButton onPress={onSubmit} iconName="check" text="Submit" />
        </View>
      </View>
      <FormButton
        style={{ width: 200 }}
        onPress={onPressBack}
        iconName="back"
        text="Go back"
      />
    </>
  );
};

const FormButton = ({ onPress, iconName, style, text, disabled }) => {
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
      disabled={disabled}
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
