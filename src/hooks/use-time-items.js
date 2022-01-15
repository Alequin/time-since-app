import isEmpty from "lodash/isEmpty";
import uniqueId from "lodash/uniqueId";
import { useCallback, useEffect, useState } from "react";
import { timeItemsRepository } from "../async-storage";
import { newTimeItem, updateTimeItem } from "../time-item-utils";

export const useTimeItems = () => {
  const [hasLoadedCache, setHasLoadedCache] = useState(false);
  const [timeItems, setTimeItems] = useState([]);

  useEffect(() => {
    let hasUnmounted = false;
    timeItemsRepository.load().then((loadedItems) => {
      if (hasUnmounted) return;
      if (!isEmpty(loadedItems)) setTimeItems(loadedItems.map(newTimeItem));
      setHasLoadedCache(true);
    });
    return () => (hasUnmounted = true);
  }, []);

  useEffect(() => {
    if (hasLoadedCache) timeItemsRepository.save(timeItems);
  }, [timeItems, hasLoadedCache]);

  return {
    timeItems,
    addTimeItem: useCallback(
      (newItem) =>
        setTimeItems((previousItems) => [
          ...previousItems,
          newTimeItem({
            title: newItem.title,
            startTime: newItem.startTime,
          }),
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
            ({ id }) => id === updatedItem.id
          );
          newItems[itemIndex] = updateTimeItem(newItems[itemIndex], {
            title: updatedItem.title,
            startTime: updatedItem.startTime,
          });
          return newItems;
        }),
      []
    ),
  };
};
