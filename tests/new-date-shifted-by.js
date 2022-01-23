export const newDateShiftedBy = (
  { date, hours, minutes, seconds },
  initialDate = new Date()
) => {
  const newDate = new Date(initialDate);
  if (date) newDate.setDate(newDate.getDate() + date);
  if (hours) newDate.setHours(newDate.getHours() + hours);
  if (minutes) newDate.setMinutes(newDate.getMinutes() + minutes);
  if (seconds) newDate.setSeconds(newDate.getSeconds() + seconds);
  return newDate;
};
