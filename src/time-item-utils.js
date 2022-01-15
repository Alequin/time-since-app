import { isDate } from "lodash";

export const newTimeItem = (options) => {
  const newItem = {
    id: randomId(),
    title: options.title,
    startTime: new Date(options.startTime),
  };

  assert(Boolean(newItem.title), "Time item requires a title property");
  assert(Boolean(newItem.startTime), "Time item requires startTime property");
  assert(
    isDate(newItem.startTime),
    "Time item property startTime must be a date object"
  );

  return Object.freeze(newItem);
};

export const newDefaultTimeItem = () =>
  newTimeItem({ title: "New Event", startTime: new Date() });

export const updateTimeItem = (previousItem, newItemOptions) => {
  return Object.freeze({
    ...newTimeItem(newItemOptions),
    id: previousItem.id,
  });
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const randomId = () => Date.now() + Math.random();
