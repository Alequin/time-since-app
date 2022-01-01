jest.mock("./src/use-current-time");
jest.mock("@react-native-community/datetimepicker");

import DateTimePicker from "@react-native-community/datetimepicker";
import { act, within } from "@testing-library/react-native";
import React from "react";
import { App } from "./App";
import { useCurrentTime } from "./src/use-current-time";
import {
  asyncPressEvent,
  asyncRender,
  getButtonByChildTestId,
  getButtonByText,
} from "./test-utils";

describe("App", () => {
  beforeEach(() => {
    useCurrentTime.mockReturnValue(new Date());
  });

  describe("When on the home page", () => {
    it("displays an add button", async () => {
      const screen = await asyncRender(<App />);
      expect(getButtonByChildTestId(screen, "plusIcon")).toBeTruthy();
    });

    it("changes the view to the new-time-item view when the add button is pressed", async () => {
      const screen = await asyncRender(<App />);

      // Start on the home view
      expect(screen.queryByTestId("home-view")).toBeTruthy();

      // Press the button to create a new time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

      // See the new-time-item view
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
    });

    it("deletes a time item if the user presses the delete button", async () => {
      const screen = await asyncRender(<App />);

      // create a time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // confirm there is a time item
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);

      // press the time items delete button
      await asyncPressEvent(
        getButtonByChildTestId(within(timeItems[0]), "trashBinIcon")
      );

      // confirm the time item has been removed
      expect(screen.queryAllByTestId("time-item")).toHaveLength(0);
    });

    it("edits a time item if the user presses the edit button, updates the date and submits", async () => {
      let capturedTimePickerOnChange = null;
      DateTimePicker.mockImplementation(({ testID, onChange }) => {
        if (testID === "time-picker") capturedTimePickerOnChange = onChange;
        return null;
      });

      const screen = await asyncRender(<App />);

      // create a time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // confirm there is a time item
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const firstTimeItems = screen.queryAllByTestId("time-item");
      expect(firstTimeItems).toHaveLength(1);
      const [firstTimeString] = within(firstTimeItems[0]).queryByTestId(
        "time-item-time-string"
      ).children;

      // press the time items edit button
      await asyncPressEvent(
        getButtonByChildTestId(within(firstTimeItems[0]), "editIcon")
      );

      // update the time
      expect(screen.queryByTestId("update-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Change Time"));

      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
      await act(async () =>
        capturedTimePickerOnChange({
          nativeEvent: { timestamp: tenMinutesAgo },
        })
      );
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the updated time string is different from the original
      const secondTimeItems = screen.queryAllByTestId("time-item");
      expect(secondTimeItems).toHaveLength(1);
      const [secondTimeString] = within(secondTimeItems[0]).queryByTestId(
        "time-item-time-string"
      ).children;

      expect(firstTimeString).not.toBe(secondTimeString);
    });
  });

  describe("While making a new time item", () => {
    it("adds a new time item for the current time when a new time item is created with the default values on the new-time-item view", async () => {
      const screen = await asyncRender(<App />);

      // Start on the home view with no time items
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      expect(screen.queryAllByTestId("time-item")).toHaveLength(0);

      // Press the button to create a new time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

      // See the new-time-item view
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

      // Press the submit button
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm we have returned to the home page and a new time item has been added
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      expect(screen.queryAllByTestId("time-item")).toHaveLength(1);
    });

    it("adds a new time item with a custom date if the user updates the date", async () => {
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

      // choose a custom date
      await asyncPressEvent(getButtonByText(screen, "Change Date"));

      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
      await act(async () =>
        capturedDatePickerOnChange({
          nativeEvent: { timestamp: fourDaysAgo },
        })
      );

      // Press the submit button
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the days past is the expected value
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);

      expect(within(timeItems[0]).queryByText("Total Days: 4"));
    });

    it("adds a new time item with a custom time if the user updates the time", async () => {
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

      // choose a custom time
      await asyncPressEvent(getButtonByText(screen, "Change Time"));

      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      await act(async () =>
        capturedTimePickerOnChange({
          nativeEvent: { timestamp: fiveMinutesAgo },
        })
      );

      // Press the submit button
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the time past is the expected value
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);
      expect(within(timeItems[0]).queryByText("00:04:59")).toBeTruthy();
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
      expect(screen.queryAllByTestId("time-item")).toHaveLength(0);

      // Press the button to create a new time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

      // See the new-time-item view
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

      // choose a custom time
      await asyncPressEvent(getButtonByText(screen, "Change Time"));

      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      await act(async () =>
        capturedTimePickerOnChange({
          nativeEvent: { timestamp: fiveMinutesAgo },
        })
      );

      // reset to the default time
      await asyncPressEvent(getButtonByText(screen, "Set time to right now"));

      // Press the submit button
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the time past is the expected value
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);
      expect(within(timeItems[0]).queryByText("00:00:00")).toBeTruthy();
    });

    it("allows the user to add multiple time items", async () => {
      const screen = await asyncRender(<App />);

      // Start on the home view with no time items
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      expect(screen.queryAllByTestId("time-item")).toHaveLength(0);

      // Add multiple time items
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm we have returned to the home page and a new time item has been added
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      expect(screen.queryAllByTestId("time-item")).toHaveLength(5);
    });
  });
});
