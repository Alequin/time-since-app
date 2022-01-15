import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo } from "react";

export const DatePickerModal = ({ isOpen, value, onChange }) => {
  return (
    <DateTimePickerModal
      testID="date-picker"
      mode="date"
      value={value}
      isOpen={isOpen}
      onChange={onChange}
    />
  );
};

export const TimePickerModal = ({ isOpen, value, onChange }) => {
  return (
    <DateTimePickerModal
      testID="time-picker"
      mode="time"
      value={value}
      isOpen={isOpen}
      onChange={onChange}
    />
  );
};

const DateTimePickerModal = ({ isOpen, value, onChange, testID, mode }) => {
  return useMemo(
    () =>
      isOpen && (
        <DateTimePicker
          testID={testID}
          value={value}
          onChange={({ nativeEvent }) =>
            onChange({
              selectedDate: nativeEvent?.timestamp,
            })
          }
          mode={mode}
        />
      ),
    [isOpen, value, onChange]
  );
};
