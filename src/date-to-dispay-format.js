import { ordinalDateNumber } from "./ordinal-Date-number";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apri",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const dateToDisplayFormat = (dateObject) => {
  const day = DAYS[dateObject.getDay()];
  const date = ordinalDateNumber(dateObject.getDate());
  const month = MONTHS[dateObject.getMonth()];
  const hour = asTwoDigitNumber(dateObject.getHours());
  const minutes = asTwoDigitNumber(dateObject.getMinutes());
  return `${day} ${date} ${month} ${hour}:${minutes}`;
};

const asTwoDigitNumber = (number) => {
  return number.toString().length === 1 ? `0${number}` : number.toString();
};
