import uniqueId from "lodash/uniqueId";
import { useCallback, useEffect, useState } from "react";
import { timeItemsRepository } from "../async-storage";

export const useTimeItems = () => {
  const [timeItems, setTimeItems] = useState([]);

  useEffect(() => {
    timeItemsRepository.load().then((loadedItems) => {
      if (loadedItems) setTimeItems(loadedItems);
    });
  }, []);

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
