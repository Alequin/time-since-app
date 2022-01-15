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
import waitForExpect from "wait-for-expect";
import { App } from "../App";
import * as asyncStorage from "../src/async-storage";
import * as useCurrentTime from "../src/hooks/use-current-time";
import { newTimeItem } from "../src/time-item-utils";
import {
  asyncPressEvent,
  asyncRender,
  enableAllErrorLogs,
  getButtonByChildTestId,
  getButtonByText,
  silenceAllErrorLogs,
} from "./test-utils";
import { newDateShiftedBy } from "./new-date-shifted-by";
import { expectTimeItemContents } from "./custom-expects/expect-time-item";

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
      jest
        .spyOn(asyncStorage.timeItemsRepository, "load")
        .mockImplementation(async () => [
          newTimeItem({
            title: "test",
            startTime: newDateShiftedBy({ date: -4 }),
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

      // Shows the expected time item
      expectTimeItemContents({
        timeItem: timeItems[0],
        title: "Loaded event",
        days: "4",
        hours: "5",
        minutes: "6",
      });
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

    it("adds a new time item with with the provided title if the user updates the title", async () => {
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

      // choose a new title
      const titleInput = screen.queryByPlaceholderText("Title");
      const expectedTitle = "Updated event title";
      await fireEvent.changeText(titleInput, expectedTitle);

      // Press the submit button
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the days past is the expected value
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const timeItems = screen.queryAllByTestId("time-item");
      expect(timeItems).toHaveLength(1);

      expectTimeItemContents({
        timeItem: timeItems[0],
        title: expectedTitle,
        days: "0",
        hours: "0",
        minutes: "0",
      });
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

      expectTimeItemContents({
        timeItem: timeItems[0],
        title: "New Event",
        days: "4",
        hours: "0",
        minutes: "0",
      });
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

      expectTimeItemContents({
        timeItem: timeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "5",
      });
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

    it("allows the user to return to the home view without creating a time item", async () => {
      const screen = await asyncRender(<App />);

      // Start on the home view with no time items
      expect(screen.queryByTestId("home-view")).toBeTruthy();

      // Press the button to create a new time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));

      // See the new-time-item view
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();

      // Press the button to return to the home view
      await asyncPressEvent(getButtonByText(screen, "Go back"));

      // Confirm we have returned to the home page
      expect(screen.queryByTestId("home-view")).toBeTruthy();
    });
  });

  describe("When editing a time item", () => {
    it("edits a time item if the user presses the edit button, updates the title and submits", async () => {
      const screen = await asyncRender(<App />);

      // create a time item
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // confirm the value of the first time item
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const firstTimeItems = screen.queryAllByTestId("time-item");
      expect(firstTimeItems).toHaveLength(1);
      expectTimeItemContents({
        timeItem: firstTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });

      // press the time items edit button
      await asyncPressEvent(
        getButtonByChildTestId(within(firstTimeItems[0]), "editIcon")
      );

      // update the title
      const titleInput = screen.queryByPlaceholderText("Title");
      const expectedTitle = "Updated event title";
      await fireEvent.changeText(titleInput, expectedTitle);

      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the updated time is different from the original
      const secondTimeItems = screen.queryAllByTestId("time-item");
      expect(secondTimeItems).toHaveLength(1);

      expectTimeItemContents({
        timeItem: secondTimeItems[0],
        title: expectedTitle,
        days: "0",
        hours: "0",
        minutes: "0",
      });
    });

    it("edits a time item if the user presses the edit button, updates the date and submits", async () => {
      let capturedDatePickerOnChange = null;
      DateTimePicker.mockImplementation(({ testID, onChange }) => {
        if (testID === "date-picker") capturedDatePickerOnChange = onChange;
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
      expectTimeItemContents({
        timeItem: firstTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });

      // press the time items edit button
      await asyncPressEvent(
        getButtonByChildTestId(within(firstTimeItems[0]), "editIcon")
      );

      // update the date
      expect(screen.queryByTestId("update-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Change Date"));

      await act(async () =>
        capturedDatePickerOnChange({
          nativeEvent: { timestamp: newDateShiftedBy({ date: -10 }) },
        })
      );
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the updated time is different from the original
      const secondTimeItems = screen.queryAllByTestId("time-item");
      expect(secondTimeItems).toHaveLength(1);

      expectTimeItemContents({
        timeItem: secondTimeItems[0],
        title: "New Event",
        days: "10",
        hours: "0",
        minutes: "0",
      });
    });

    it("edits a time item if the user presses the edit button, updates the time and submits", async () => {
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
      expectTimeItemContents({
        timeItem: firstTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });

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

      expectTimeItemContents({
        timeItem: secondTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "10",
      });
    });

    it("edits the correct time item if the user presses the edit button, updates the values and submits", async () => {
      const screen = await asyncRender(<App />);

      // create 2 time items
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));
      await asyncPressEvent(getButtonByChildTestId(screen, "plusIcon"));
      expect(screen.queryByTestId("new-time-item-view")).toBeTruthy();
      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // confirm the value of the second time item
      expect(screen.queryByTestId("home-view")).toBeTruthy();
      const firstTimeItems = screen.queryAllByTestId("time-item");
      expect(firstTimeItems).toHaveLength(2);
      expectTimeItemContents({
        timeItem: firstTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });
      expectTimeItemContents({
        timeItem: firstTimeItems[1],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });

      // press the second time items edit button
      await asyncPressEvent(
        getButtonByChildTestId(within(firstTimeItems[1]), "editIcon")
      );

      // update the title
      const titleInput = screen.queryByPlaceholderText("Title");
      const expectedTitle = "Updated event title";
      await fireEvent.changeText(titleInput, expectedTitle);

      await asyncPressEvent(getButtonByText(screen, "Submit"));

      // Confirm the updated time is different from the original on the correct time item
      const secondTimeItems = screen.queryAllByTestId("time-item");
      expect(secondTimeItems).toHaveLength(2);

      expectTimeItemContents({
        timeItem: secondTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });
      expectTimeItemContents({
        timeItem: secondTimeItems[1],
        title: expectedTitle,
        days: "0",
        hours: "0",
        minutes: "0",
      });
    });

    it("allows the user to return to the home view without editing the selected time item", async () => {
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
      expectTimeItemContents({
        timeItem: firstTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });

      // press the time items edit button
      await asyncPressEvent(
        getButtonByChildTestId(within(firstTimeItems[0]), "editIcon")
      );

      // press the button to return to the home view rather than the submit button
      await asyncPressEvent(getButtonByText(screen, "Go back"));

      // Confirm the updated time is the same as the original
      const secondTimeItems = screen.queryAllByTestId("time-item");
      expect(secondTimeItems).toHaveLength(1);

      expectTimeItemContents({
        timeItem: secondTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });
    });

    it("allows the user to return to the home view without editing the selected time item, even if they update the time value but then change their mind", async () => {
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
      expectTimeItemContents({
        timeItem: firstTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });

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

      // press the button to return to the home view rather than the submit button
      await asyncPressEvent(getButtonByText(screen, "Go back"));

      // Confirm the updated time is the same as the original
      const secondTimeItems = screen.queryAllByTestId("time-item");
      expect(secondTimeItems).toHaveLength(1);

      expectTimeItemContents({
        timeItem: secondTimeItems[0],
        title: "New Event",
        days: "0",
        hours: "0",
        minutes: "0",
      });
    });
  });

  it("Returns the app to a default state when an unrecoverable error occures", async () => {
    // Mock apart of the logic encoutering a fatal error
    useCurrentTime.useCurrentTime.mockImplementation(() => {
      throw new Error("mock fatal error to force app restart");
    });

    silenceAllErrorLogs();

    const screen = await asyncRender(<App />);

    // Confirm the error page is visible
    await waitForExpect(async () => {
      expect(screen.queryByTestId("error-view")).toBeTruthy();
      expect(
        screen.queryByText("Sorry, the app has encountered an issue")
      ).toBeTruthy();
    });

    // Reset the mocked code to work again
    useCurrentTime.useCurrentTime.mockImplementation(() => new Date());

    // Confirm the home view is visible
    await waitForExpect(async () =>
      expect(screen.queryByTestId("home-view")).toBeTruthy()
    );

    enableAllErrorLogs();
  }, 10000);
});
