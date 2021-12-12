import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { HomeView } from "./views/home-view";
import { NewTimeItemView } from "./views/new-time-item-view";

export const MainView = () => {
  const { activeView, toHomeView, toNewTimeItemView } = useViewNavigation();
  const { timeItems, addTimeItem } = useTimeItems();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {activeView === VIEWS.HOME_VIEW && (
        <HomeView toNewTimeItemView={toNewTimeItemView} timeItems={timeItems} />
      )}
      {activeView === VIEWS.NEW_TIME_ITEM_VIEW && (
        <NewTimeItemView toHomeView={toHomeView} addTimeItem={addTimeItem} />
      )}
    </View>
  );
};

const VIEWS = {
  HOME_VIEW: "HOME_VIEW",
  NEW_TIME_ITEM_VIEW: "NEW_TIME_ITEM_VIEW",
};

const useViewNavigation = () => {
  const [activeView, setActiveView] = useState(VIEWS.HOME_VIEW);

  return {
    activeView,
    toHomeView: useCallback(() => setActiveView(VIEWS.HOME_VIEW), []),
    toNewTimeItemView: useCallback(() => setActiveView(VIEWS.NEW_TIME_ITEM_VIEW), []),
  };
};

const useTimeItems = () => {
  const [timeItems, setTimeItems] = useState([
    { title: `Time since visiting the store`, startTime: new Date("2021-12-12T19:00:00") },
  ]);

  return {
    timeItems,
    addTimeItem: useCallback(
      (newItem) => setTimeItems((previousItems) => [...previousItems, newItem]),
      []
    ),
  };
};
