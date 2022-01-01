import uniqueId from "lodash/uniqueId";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useCurrentTime } from "./use-current-time";
import { HomeView } from "./views/home-view";
import { TimeItemFormView } from "./views/time-item-form-view";

const VIEWS = {
  HOME_VIEW: "HOME_VIEW",
  NEW_TIME_ITEM_VIEW: "NEW_TIME_ITEM_VIEW",
  UPDATE_TIME_ITEM_VIEW: "EDIT_TIME_ITEM_VIEW",
};

export const MainView = () => {
  const currentTime = useCurrentTime();

  const { activeView, toHomeView, toNewTimeItemView, toUpdateTimeItemView } =
    useViewNavigation();
  const { timeItems, addTimeItem, removeTimeItem, updateTimeItem } =
    useTimeItems();

  const [itemToUpdate, setItemToUpdate] = useState(null);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {activeView === VIEWS.HOME_VIEW && (
        <HomeView
          testID="home-view"
          timeItems={timeItems}
          currentTime={currentTime}
          onAddNewItem={toNewTimeItemView}
          onUpdateItem={(itemToUpdate) => {
            setItemToUpdate(itemToUpdate);
            toUpdateTimeItemView();
          }}
          onRemoveItem={removeTimeItem}
        />
      )}
      {activeView === VIEWS.NEW_TIME_ITEM_VIEW && (
        <TimeItemFormView
          testID="new-time-item-view"
          currentTime={currentTime}
          onSubmit={(item) => {
            addTimeItem(item);
            toHomeView();
          }}
          onPressBack={toHomeView}
        />
      )}
      {activeView === VIEWS.UPDATE_TIME_ITEM_VIEW && (
        <TimeItemFormView
          testID="update-time-item-view"
          currentTime={currentTime}
          initialTimeItem={itemToUpdate}
          onSubmit={(item) => {
            updateTimeItem(item);
            toHomeView();
          }}
          onPressBack={toHomeView}
        />
      )}
    </View>
  );
};

const useViewNavigation = () => {
  const [activeView, setActiveView] = useState(VIEWS.HOME_VIEW);

  return {
    activeView,
    toHomeView: useCallback(() => setActiveView(VIEWS.HOME_VIEW), []),
    toNewTimeItemView: useCallback(
      () => setActiveView(VIEWS.NEW_TIME_ITEM_VIEW),
      []
    ),
    toUpdateTimeItemView: useCallback(
      () => setActiveView(VIEWS.UPDATE_TIME_ITEM_VIEW),
      []
    ),
  };
};

const useTimeItems = () => {
  const [timeItems, setTimeItems] = useState([]);

  return {
    timeItems,
    addTimeItem: useCallback(
      (newItem) =>
        setTimeItems((previousItems) => [
          ...previousItems,
          {
            id: uniqueId(),
            title: newItem.title,
            startTime: newItem.startTime,
          },
        ]),
      []
    ),
    removeTimeItem: useCallback(
      (itemToRemove) =>
        setTimeItems((previousItems) =>
          previousItems.filter(({ id }) => id !== itemToRemove.id)
        ),
      []
    ),
    updateTimeItem: useCallback(
      (updatedItem) =>
        setTimeItems((previousItems) => {
          const newItems = [...previousItems];
          const itemIndex = newItems.findIndex(
            ({ id }) => id !== updatedItem.id
          );
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            title: updatedItem.title,
            startTime: updatedItem.startTime,
          };
          return newItems;
        }),
      []
    ),
  };
};
