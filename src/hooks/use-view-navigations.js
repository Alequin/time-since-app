import { useCallback, useState } from "react";

const VIEWS = {
  HOME_VIEW: "HOME_VIEW",
  NEW_TIME_ITEM_VIEW: "NEW_TIME_ITEM_VIEW",
  UPDATE_TIME_ITEM_VIEW: "EDIT_TIME_ITEM_VIEW",
};

export const useViewNavigation = () => {
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
