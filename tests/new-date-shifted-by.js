export const newDateShiftedBy = ({ date, hours, minutes }) => {
  const newDate = new Date();
  if (date) newDate.setDate(newDate.getDate() + date);
  if (hours) newDate.setHours(newDate.getHours() + hours);
  if (minutes) newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};
