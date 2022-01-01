import { isDate } from "lodash";

export const newTimeItem = (options) => {
  const newItem = {
    title: options.title,
    startTime: options.startTime,
  };

  assert(Boolean(newItem.title), "Time item requires a title property");
  assert(Boolean(newItem.startTime), "Time item requires startTime property");
  assert(
    isDate(newItem.startTime),
    "Time item property startTime must be a date object"
  );

  return newItem;
};

export const newDefaultTimeItem = () =>
  newTimeItem({ title: "New Event", startTime: new Date() });

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
