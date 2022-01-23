export const ordinalDateNumber = (number) => {
  const numberAsString = number.toString();

  if (numberAsString.endsWith("1") && !numberAsString.endsWith("11"))
    return `${number}st`;

  if (numberAsString.endsWith("2") && !numberAsString.endsWith("12"))
    return `${number}nd`;

  if (numberAsString.endsWith("3") && !numberAsString.endsWith("13"))
    return `${number}rd`;

  return `${number}th`;
};
