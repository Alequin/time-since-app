jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock("../src/hooks/use-current-time");
jest.mock("@react-native-community/datetimepicker");

import DateTimePicker from "@react-native-community/datetimepicker";
import { act, fireEvent, within } from "@testing-library/react-native";
import React from "react";
import { App } from "../App";
import * as asyncStorage from "../src/async-storage";
import * as useCurrentTime from "../src/hooks/use-current-time";
import {
  asyncPressEvent,
  asyncRender,
  buttonProps,
  getButtonByChildTestId,
  getButtonByText,
} from "./test-utils";
import { newDateShiftedBy } from "./new-date-shifted-by";
import { expectTimeItemContents } from "./custom-expects/expect-time-item";
import { newTimeItem } from "../src/time-item-utils";

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
        nativeEvent: {
          timestamp: newDateShiftedBy({
            hours: -5,
            seconds: -30, // offset to stop flakyness due to seconds
          }),
        },
      })
    );

    // confirm update happened
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "5",
      minutes: "0",
    });

    // reset to the default
    await asyncPressEvent(getButtonByText(screen, "Reset"));

    // Confirm the the time and title were reset
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });
  });

  it("allows the user to reset to the default title while making a time item", async () => {
    const screen = await asyncRender(<App />);

    // Start on the home view with no time items
    expect(screen.queryByTestId("home-view")).toBeTruthy();

    // Press the button to create a new time item
    await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

    // See the new-time-item view
    expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

    // choose a custom title
    const expectedTitle = "Updated event title";
    await fireEvent.changeText(
      screen.queryByPlaceholderText("Title"),
      expectedTitle
    );

    // confirm update happened
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: expectedTitle,
      days: "0",
      hours: "0",
      minutes: "0",
    });

    // reset to the default
    await asyncPressEvent(getButtonByText(screen, "Reset"));

    // Confirm the the time and title were reset
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "New Event",
      days: "0",
      hours: "0",
      minutes: "0",
    });
  });

  it("allows the user to reset to the initial time while editing a time item", async () => {
    jest
      .spyOn(asyncStorage.timeItemsRepository, "load")
      .mockImplementation(async () => [
        newTimeItem({
          title: "test",
          startTime: newDateShiftedBy({ date: -4 }),
        }),
      ]);

    let capturedTimePickerOnChange = null;
    DateTimePicker.mockImplementation(({ testID, onChange }) => {
      if (testID === "time-picker") capturedTimePickerOnChange = onChange;
      return null;
    });

    const screen = await asyncRender(<App />);

    // confirm the value of the first time item
    expect(screen.queryByTestId("home-view")).toBeTruthy();
    const firstTimeItems = screen.queryAllByTestId("time-item");
    expect(firstTimeItems).toHaveLength(1);
    expectTimeItemContents({
      timeItem: firstTimeItems[0],
      title: "test",
      days: "4",
      hours: "0",
      minutes: "0",
    });

    // press the time items edit button
    await asyncPressEvent(
      getButtonByChildTestId(within(firstTimeItems[0]), "editIcon")
    );

    // edit the time
    expect(screen.queryByTestId("update-time-item-view")).toBeTruthy();
    await asyncPressEvent(getButtonByText(screen, "Change Time"));

    await act(async () =>
      capturedTimePickerOnChange({
        nativeEvent: {
          timestamp: newDateShiftedBy({
            minutes: -10,
            seconds: -30, // offset to stop flakyness due to seconds
          }),
        },
      })
    );

    // confirm the update happened
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "test",
      days: "4",
      hours: "0",
      minutes: "10",
    });

    // reset to the default
    await asyncPressEvent(getButtonByText(screen, "Reset"));

    // Confirm the the time and title were reset
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "test",
      days: "4",
      hours: "0",
      minutes: "0",
    });
  });

  it("allows the user to reset to the initial title while editing a time item", async () => {
    jest
      .spyOn(asyncStorage.timeItemsRepository, "load")
      .mockImplementation(async () => [
        newTimeItem({
          title: "test",
          startTime: newDateShiftedBy({ date: -4 }),
        }),
      ]);

    const screen = await asyncRender(<App />);

    // confirm the value of the first time item
    expect(screen.queryByTestId("home-view")).toBeTruthy();
    const firstTimeItems = screen.queryAllByTestId("time-item");
    expect(firstTimeItems).toHaveLength(1);
    expectTimeItemContents({
      timeItem: firstTimeItems[0],
      title: "test",
      days: "4",
      hours: "0",
      minutes: "0",
    });

    // press the time items edit button
    await asyncPressEvent(
      getButtonByChildTestId(within(firstTimeItems[0]), "editIcon")
    );

    // edit the title
    const editedTitle = "Updated event title";
    await fireEvent.changeText(
      screen.queryByPlaceholderText("Title"),
      editedTitle
    );

    // confirm the update happened
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: editedTitle,
      days: "4",
      hours: "0",
      minutes: "0",
    });

    // reset to the default
    await asyncPressEvent(getButtonByText(screen, "Reset"));

    // Confirm the the time and title were reset
    expectTimeItemContents({
      timeItem: screen.queryByTestId("time-item"),
      title: "test",
      days: "4",
      hours: "0",
      minutes: "0",
    });
  });

  it("disables the reset button if there is nothing to reset", async () => {
    let capturedTimePickerOnChange = null;
    DateTimePicker.mockImplementation(({ testID, onChange }) => {
      if (testID === "time-picker") capturedTimePickerOnChange = onChange;
      return null;
    });

    const screen = await asyncRender(<App />);

    // Press the button to create a new time item
    await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

    // See the new-time-item view
    expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

    // Confirm the reset button is disabled
    expect(buttonProps(getButtonByText(screen, "Reset"))?.disabled).toBe(true);
  });

  it("disables the reset button after reseting the time on a new time item", async () => {
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
        nativeEvent: {
          timestamp: newDateShiftedBy({
            hours: -5,
            seconds: -30, // offset to stop flakyness due to seconds
          }),
        },
      })
    );

    // reset to the default
    await asyncPressEvent(getButtonByText(screen, "Reset"));

    // Confirm the reset button is disabled
    expect(buttonProps(getButtonByText(screen, "Reset"))?.disabled).toBe(true);
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
        nativeEvent: {
          timestamp: newDateShiftedBy({ minutes: -5 }),
        },
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
