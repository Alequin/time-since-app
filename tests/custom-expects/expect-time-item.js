import { within } from "@testing-library/react-native";

export const expectTimeItemContents = ({
  timeItem,
  title,
  days,
  hours,
  minutes,
}) => {
  expect(title).toEqual(expect.any(String));
  try {
    expect(within(timeItem).queryByText(title)).toBeTruthy();
  } catch (error) {
    throw new Error(
      `The expected title on the time item was not found / Expected title: ${title}`
    );
  }

  expect(days).toBeTruthy();
  expect(hours).toBeTruthy();
  expect(minutes).toBeTruthy();

  expectTimeUnitInTimeItem({
    timeItem,
    unitId: "Days-unit",
    value: days,
    label: "Days",
  });

  expectTimeUnitInTimeItem({
    timeItem,
    unitId: "Hours-unit",
    value: hours,
    label: "Hours",
  });

  expectTimeUnitInTimeItem({
    timeItem,
    unitId: "Minutes-unit",
    value: minutes,
    label: "Minutes",
  });

  // Seconds are flaky to test so rely on "get-time-since.js" unit tests to confirm the value is as expected
  expectTimeUnitInTimeItem({
    timeItem,
    unitId: "Seconds-unit",
    value: /\d?\d/,
    label: "Seconds",
  });
};

const expectTimeUnitInTimeItem = ({ timeItem, unitId, value, label }) => {
  try {
    expect(
      within(within(timeItem).queryByTestId(unitId)).queryByText(label)
    ).toBeTruthy();
    expect(
      within(within(timeItem).queryByTestId(unitId)).queryByText(value)
    ).toBeTruthy();
  } catch (error) {
    throw new Error(
      `A time item unit was not the expected value / Label: ${label}, Expected value: ${value}`
    );
  }
};
