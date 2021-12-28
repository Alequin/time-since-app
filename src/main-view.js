import uniqueId from "lodash/uniqueId";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { HomeView } from "./views/home-view";
import { TimeItemFormView } from "./views/time-item-form-view";

const VIEWS = {
  HOME_VIEW: "HOME_VIEW",
  NEW_TIME_ITEM_VIEW: "NEW_TIME_ITEM_VIEW",
  UPDATE_TIME_ITEM_VIEW: "EDIT_TIME_ITEM_VIEW",
};

export const MainView = () => {
  const { activeView, toHomeView, toNewTimeItemView, toUpdateTimeItemView } =
    useViewNavigation();
  const { timeItems, addTimeItem, removeTimeItem, updateTimeItem } =
    useTimeItems();

  const [itemToUpdate, setItemToUpdate] = useState(null);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {activeView === VIEWS.HOME_VIEW && (
        <HomeView
          timeItems={timeItems}
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
          onSubmit={(item) => {
            addTimeItem(item);
            toHomeView();
          }}
          onPressBack={toHomeView}
        />
      )}
      {activeView === VIEWS.UPDATE_TIME_ITEM_VIEW && (
        <TimeItemFormView
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
  const [timeItems, setTimeItems] = useState([
    {
      id: uniqueId(),
      title: `Time since visiting the store`,
      startTime: new Date("2021-12-12T19:00:00"),
    },
  ]);

  return {
    timeItems,
    addTimeItem: useCallback(
      (newItem) =>
        setTimeItems((previousItems) => [
          ...previousItems,
          { id: uniqueId(), ...newItem },
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
      (editedItem) =>
        setTimeItems((previousItems) => {
          const newItems = [...previousItems];
          const itemIndex = newItems.findIndex(
            ({ id }) => id !== editedItem.id
          );
          newItems[itemIndex] = editedItem;
          return newItems;
        }),
      []
    ),
  };
};
