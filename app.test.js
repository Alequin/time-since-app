jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock("./src/hooks/use-current-time");
jest.mock("@react-native-community/datetimepicker");

import DateTimePicker from "@react-native-community/datetimepicker";
import { act, fireEvent, render, within } from "@testing-library/react-native";
import React from "react";
import { App } from "./App";
import * as asyncStorage from "./src/async-storage";
import * as useCurrentTime from "./src/hooks/use-current-time";
import { newTimeItem } from "./src/time-item-utils";
import { TimeItem } from "./src/time-item";
import {
  asyncPressEvent,
  asyncRender,
  getButtonByChildTestId,
  getButtonByText,
} from "./test-utils";

describe("App", () => {
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

  describe("When on the home page", () => {
    it("displays an add button", async () => {
      const screen = await asyncRender(<App />);
      expect(getButtonByChildTestId(screen, "plusIcon")).toBeTruthy();
    });

    it("loads stored time items", async () => {
      const fourDaysAgo = newDateShiftedBy({ date: -4 });
      jest
        .spyOn(asyncStorage.timeItemsRepository, "load")
        .mockImplementation(async () => [
          newTimeItem({
            title: "test",
            startTime: fourDaysAgo,
          }),
        ]);

      const screen = await asyncRender(<App />);

      // Start on the home view
      expect(screen.queryByTestId("home-view")).toBeTruthy();

      // confirm the time item repository was read
      expect(asyncStorage.timeItemsRepository.load).toHaveBeenCalledTimes(1);

      // confirm the stored time item is visible
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);
      expect(within(timeItems[0]).queryByText("4"));
    });

    it("displays the expected time on the home page time item when one is loaded", async () => {
      const fourDaysAgo = newDateShiftedBy({
        date: -4,
        hours: -5,
        minutes: -6,
      });
      jest
        .spyOn(asyncStorage.timeItemsRepository, "load")
        .mockImplementation(async () => [
          newTimeItem({
            title: "Loaded event",
            startTime: fourDaysAgo,
          }),
        ]);

      const screen = await asyncRender(<App />);

      // Start on the home view
      expect(screen.queryByTestId("home-view")).toBeTruthy();

      // confirm the time item repository was read
      expect(asyncStorage.timeItemsRepository.load).toHaveBeenCalledTimes(1);

      // confirm the stored time item is visible
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);

      const withinTimeItem = within(timeItems[0]);
      // Shows the item title
      expect(withinTimeItem.queryByText("Loaded event")).toBeTruthy();

      expect(
        within(withinTimeItem.queryByTestId("Days-unit")).queryByText("4")
      ).toBeTruthy();
      expect(
        within(withinTimeItem.queryByTestId("Days-unit")).queryByText("Days")
      ).toBeTruthy();

      expect(
        within(withinTimeItem.queryByTestId("Hours-unit")).queryByText("5")
      ).toBeTruthy();
      expect(
        within(withinTimeItem.queryByTestId("Hours-unit")).queryByText("Hours")
      ).toBeTruthy();

      expect(
        within(withinTimeItem.queryByTestId("Minutes-unit")).queryByText("6")
      ).toBeTruthy();
      expect(
        within(withinTimeItem.queryByTestId("Minutes-unit")).queryByText(
          "Minutes"
        )
      ).toBeTruthy();
    });

    it("loads stored time items but displays non if there are non saved", async () => {
      jest
        .spyOn(asyncStorage.timeItemsRepository, "load")
        .mockImplementation(async () => null); // No saved time items

      const screen = await asyncRender(<App />);

      // Start on the home view
      expect(screen.queryByTestId("home-view")).toBeTruthy();

      // confirm the time item repository was read
      expect(asyncStorage.timeItemsRepository.load).toHaveBeenCalledTimes(1);

      // confirm no stored time items are visible
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(0);
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
  });

  describe("When making a new time item", () => {
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

      const fourDaysAgo = newDateShiftedBy({ date: -4 });
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

      const fiveMinutesAgo = newDateShiftedBy({ minutes: -5 });
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
      const withinTimeItem = within(timeItems[0]);
      expect(
        within(withinTimeItem.queryByTestId("Days-unit")).queryByText("0")
      ).toBeTruthy();
      expect(
        within(withinTimeItem.queryByTestId("Hours-unit")).queryByText("0")
      ).toBeTruthy();
      expect(
        within(withinTimeItem.queryByTestId("Minutes-unit")).queryByText("5")
      ).toBeTruthy();
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

      const withinTimeItem = within(timeItems[0]);
      expect(
        within(withinTimeItem.queryByTestId("Days-unit")).queryByText("0")
      ).toBeTruthy();
      expect(
        within(withinTimeItem.queryByTestId("Hours-unit")).queryByText("0")
      ).toBeTruthy();
      expect(
        within(withinTimeItem.queryByTestId("Minutes-unit")).queryByText("0")
      ).toBeTruthy();
    });

    it("adds the new time item into storage when it is created", async () => {
      const screen = await asyncRender(<App />);

      // Start on the home view with no time items
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      expect(screen.queryAllByTestId("time-item")).toHaveLength(0);

      // Press the button to create a new time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

      // See the new-time-item view
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

      // Reset save cache mock to ensure the call count is correct
      asyncStorage.timeItemsRepository.save.mockClear();

      // Press the submit button
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm a new time item was saved in storage
      expect(asyncStorage.timeItemsRepository.save).toHaveBeenCalledTimes(1);
      expect(asyncStorage.timeItemsRepository.save).toHaveBeenCalledWith([
        {
          id: expect.any(Number),
          title: "New Event",
          startTime: expect.any(Date),
        },
      ]);
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
      const initialTimeItem = screen.queryByTestId("time-item");
      expect(within(initialTimeItem).queryByText("New Event")).toBeTruthy();

      const withinInitialTimeItem = within(initialTimeItem);
      expect(
        within(withinInitialTimeItem.queryByTestId("Minutes-unit")).queryByText(
          "0"
        )
      ).toBeTruthy();

      // Update the title
      const expectedTitle = "Last visit to the shop";
      const titleInput = screen.queryByPlaceholderText("Title");
      await fireEvent.changeText(titleInput, expectedTitle);

      // Update the date
      await asyncPressEvent(getButtonByText(screen, "Change Date"));

      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
      await act(async () =>
        capturedDatePickerOnChange({
          nativeEvent: { timestamp: fourDaysAgo },
        })
      );

      // update the time
      await asyncPressEvent(getButtonByText(screen, "Change Time"));

      await act(async () =>
        capturedTimePickerOnChange({
          nativeEvent: { timestamp: newDateShiftedBy({ minutes: -5 }) },
        })
      );

      // confirm the template time item has updated
      const updatedTimeItem = screen.queryByTestId("time-item");
      expect(within(updatedTimeItem).queryByText(expectedTitle)).toBeTruthy();
      expect(
        within(
          within(updatedTimeItem).queryByTestId("Minutes-unit")
        ).queryByText("5")
      ).toBeTruthy();
    });
  });

  describe("When editing a time item", () => {
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

      // confirm the value of the first time item
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const firstTimeItems = screen.queryAllByTestId("time-item");
      expect(firstTimeItems).toHaveLength(1);
      const withinFirstTimeItem = within(firstTimeItems[0]);
      expect(
        within(withinFirstTimeItem.queryByTestId("Days-unit")).queryByText("0")
      ).toBeTruthy();
      expect(
        within(withinFirstTimeItem.queryByTestId("Hours-unit")).queryByText("0")
      ).toBeTruthy();
      expect(
        within(withinFirstTimeItem.queryByTestId("Minutes-unit")).queryByText(
          "0"
        )
      ).toBeTruthy();

      // press the time items edit button
      await asyncPressEvent(
        getButtonByChildTestId(within(firstTimeItems[0]), "editIcon")
      );

      // update the time
      expect(screen.queryByTestId("update-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Change Time"));

      await act(async () =>
        capturedTimePickerOnChange({
          nativeEvent: { timestamp: newDateShiftedBy({ minutes: -10 }) },
        })
      );
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the updated time is different from the original
      const secondTimeItems = screen.queryAllByTestId("time-item");
      expect(secondTimeItems).toHaveLength(1);

      const withinSecondTimeItem = within(secondTimeItems[0]);
      expect(
        within(withinSecondTimeItem.queryByTestId("Minutes-unit")).queryByText(
          "10"
        )
      ).toBeTruthy();
    });

    it("shows a template time item using the values from the time item to edit", async () => {
      const fourDaysAgo = newDateShiftedBy({ date: -4 });
      jest
        .spyOn(asyncStorage.timeItemsRepository, "load")
        .mockImplementation(async () => [
          newTimeItem({
            title: "test",
            startTime: fourDaysAgo,
          }),
        ]);

      const screen = await asyncRender(<App />);

      // confirm the stored time item is visible
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);
      expect(within(timeItems[0]).queryByText("Total Days: 4"));

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
  });
});

const newDateShiftedBy = ({ date, hours, minutes }) => {
  const newDate = new Date();
  if (date) newDate.setDate(newDate.getDate() + date);
  if (hours) newDate.setHours(newDate.getHours() + hours);
  if (minutes) newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};
