jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock("./src/hooks/use-current-time");
jest.mock("@react-native-community/datetimepicker");

import DateTimePicker from "@react-native-community/datetimepicker";
import { act, fireEvent, within } from "@testing-library/react-native";
import React from "react";
import { App } from "./App";
import * as asyncStorage from "./src/async-storage";
import * as useCurrentTime from "./src/hooks/use-current-time";
import {
  asyncPressEvent,
  asyncRender,
  getButtonByChildTestId,
  getButtonByText,
} from "./test-utils";
import { newDateShiftedBy } from "./tests/new-date-shifted-by";

describe("App - time item form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCurrentTime.useCurrentTime.mockImplementation(() => new Date());
    jest
      .spyOn(asyncStorage.timeItemsRepository, "save")
      .mockImplementation(async () => {});
    jest
      .spyOn(asyncStorage.timeItemsRepository, "load")
      .mockImplementation(async () => []);
  });

  it("allows the user to reset to the default time while making a time item", async () => {
    let capturedTimePickerOnChange = null;
    DateTimePicker.mockImplementation(({ testID, onChange }) => {
      if (testID === "time-picker") capturedTimePickerOnChange = onChange;
      return null;
    });

    const screen = await asyncRender(<App />);

    // Start on the home view with no time items
    expect(screen.queryByTestId("home-view")).toBeTruthy();

    // Press the button to create a new time item
    await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

    // See the new-time-item view
    expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

    // choose a custom time
    await asyncPressEvent(getButtonByText(screen, "Change Time"));

    await act(async () =>
      capturedTimePickerOnChange({
        nativeEvent: { timestamp: newDateShiftedBy({ minutes: -5 }) },
      })
    );

    // reset to the default time
    await asyncPressEvent(getButtonByText(screen, "Set time to right now"));

    // Confirm the time past is the expected value
    const timeItems = screen.queryAllByTestId("time-item");
    expect(timeItems).toHaveLength(1);

    expectTimeItemContents({
      timeItem: timeItems[0],
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });
  });

  it("displays a template time item while on the new-time-item page", async () => {
    const screen = await asyncRender(<App />);

    // User starts to create a new time item
    expect(screen.queryByTestId("home-view")).toBeTruthy();
    await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
    expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

    // Confirm a default time item is visible
    const timeItem = screen.queryByTestId("time-item");
    expect(within(timeItem).queryByText("New Event"));
    expect(within(timeItem).queryByText("Total Days: 0"));
    expect(within(timeItem).queryByText("00:00"));
  });

  it("udpates the time item template on the new-time-item page as the user changes the settings", async () => {
    let capturedDatePickerOnChange = null;
    let capturedTimePickerOnChange = null;
    DateTimePicker.mockImplementation(({ testID, onChange }) => {
      if (testID === "date-picker") capturedDatePickerOnChange = onChange;
      if (testID === "time-picker") capturedTimePickerOnChange = onChange;
      return null;
    });

    const screen = await asyncRender(<App />);

    // User starts to create a new time item
    expect(screen.queryByTestId("home-view")).toBeTruthy();
    await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
    expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

    // Confirm a default time item is visible
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });

    // Update the title
    const expectedTitle = "Last visit to the shop";
    const titleInput = screen.queryByPlaceholderText("Title");
    await fireEvent.changeText(titleInput, expectedTitle);

    // Update the date
    await asyncPressEvent(getButtonByText(screen, "Change Date"));

    await act(async () =>
      capturedDatePickerOnChange({
        nativeEvent: { timestamp: newDateShiftedBy({ date: -4 }) },
      })
    );

    // update the time
    await asyncPressEvent(getButtonByText(screen, "Change Time"));

    await act(async () =>
      capturedTimePickerOnChange({
        nativeEvent: { timestamp: newDateShiftedBy({ minutes: -5 }) },
      })
    );
    await asyncPressEvent(getButtonByText(screen, "Submit"));

    // confirm the template time item has updated
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: expectedTitle,
      days: "4",
      hours: "0",
      minutes: "5",
    });
  });

  it("allows the user to start editing the date with the date picker modal but then cancel the selection", async () => {
    let capturedDatePickerOnChange = null;
    DateTimePicker.mockImplementation(({ testID, onChange }) => {
      if (testID === "date-picker") capturedDatePickerOnChange = onChange;
      return null;
    });

    const screen = await asyncRender(<App />);

    // Start on the home view with no time items
    expect(screen.queryByTestId("home-view")).toBeTruthy();
    expect(screen.queryAllByTestId("time-item")).toHaveLength(0);

    // Press the button to create a new time item
    await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

    // See the new-time-item view
    expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

    // Confirm the template time item shows the expected values
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });

    // close the date picker modal without selecting a date
    await asyncPressEvent(getButtonByText(screen, "Change Date"));

    await act(async () =>
      capturedDatePickerOnChange({
        nativeEvent: { timestamp: undefined }, // return no timestamp to fake the close event
      })
    );

    // Confirm the days past has not changed
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });
  });

  it("allows the user to start editing the time with the time picker modal but then cancel the selection", async () => {
    let capturedTimePickerOnChange = null;
    DateTimePicker.mockImplementation(({ testID, onChange }) => {
      if (testID === "time-picker") capturedTimePickerOnChange = onChange;
      return null;
    });

    const screen = await asyncRender(<App />);

    // Start on the home view with no time items
    expect(screen.queryByTestId("home-view")).toBeTruthy();
    expect(screen.queryAllByTestId("time-item")).toHaveLength(0);

    // Press the button to create a new time item
    await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

    // See the new-time-item view
    expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

    // Confirm the template time item shows the expected values
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });

    // close the date picker modal without selecting a date
    await asyncPressEvent(getButtonByText(screen, "Change Time"));

    await act(async () =>
      capturedTimePickerOnChange({
        nativeEvent: { timestamp: undefined }, // return no timestamp to fake the close event
      })
    );

    // Confirm the time past has not changed
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });
  });
});

const expectTimeItemContents = ({ timeItem, title, days, hours, minutes }) => {
  expect(title).toBeTruthy();
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
