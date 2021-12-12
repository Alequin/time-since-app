export const getTimeSince = (startDate, endDate = new Date()) => {
  const millisecondsPast = endDate.getTime() - startDate.getTime();

  const days = millisecondsToDays(millisecondsPast);
  const daysToDisplay = Math.floor(days);
  const remainingDaysInMilliseconds = millisecondsPast - daysToMilliseconds(daysToDisplay);

  const hours = millisecondsToHours(remainingDaysInMilliseconds);
  const hoursToDisplay = Math.floor(hours);
  const remainingHoursInMilliseconds =
    remainingDaysInMilliseconds - hoursToMilliseconds(hoursToDisplay);

  const minutes = millisecondsToMinutes(remainingHoursInMilliseconds);
  const minuteToDisplay = Math.floor(minutes);
  const remainingMinutesInMilliseconds =
    remainingHoursInMilliseconds - minutesToMilliseconds(minuteToDisplay);

  const seconds = millisecondsToSeconds(remainingMinutesInMilliseconds);
  const secondsToDisplay = Math.floor(seconds);

  return {
    days: daysToDisplay,
    hours: hoursToDisplay,
    minutes: minuteToDisplay,
    seconds: secondsToDisplay,
  };
};

const millisecondsToMilliseconds = (numOfMilliseconds) => numOfMilliseconds;
const secondsToMilliseconds = (numOfSeconds) => millisecondsToMilliseconds(numOfSeconds) * 1000;
const minutesToMilliseconds = (numOfMinutes) => secondsToMilliseconds(numOfMinutes) * 60;
const hoursToMilliseconds = (numOfHours) => minutesToMilliseconds(numOfHours) * 60;
const daysToMilliseconds = (numOfDays) => hoursToMilliseconds(numOfDays) * 24;

const millisecondsToSeconds = (milliseconds) => milliseconds / 1000;
const millisecondsToMinutes = (milliseconds) => millisecondsToSeconds(milliseconds) / 60;
const millisecondsToHours = (milliseconds) => millisecondsToMinutes(milliseconds) / 60;
const millisecondsToDays = (milliseconds) => millisecondsToHours(milliseconds) / 24;
