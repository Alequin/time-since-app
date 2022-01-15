import React, { useState } from "react";
import { View } from "react-native";
import { timeItemsRepository } from "./async-storage";
import { useCurrentTime } from "./hooks/use-current-time";
import { useTimeItems } from "./hooks/use-time-items";
import { useViewNavigation } from "./hooks/use-view-navigations";
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
