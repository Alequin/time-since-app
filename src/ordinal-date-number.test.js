import { ordinalDateNumber } from "./ordinal-Date-number";

describe("ordinalNumbers", () => {
  it.each([
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 25, 26,
    27, 28, 29, 30,
  ])("appends th onto the number %s", (number) => {
    expect(ordinalDateNumber(number)).toBe(`${number}th`);
  });

  it.each([1, 21, 31])("appends st onto the number %s", (number) => {
    expect(ordinalDateNumber(number)).toBe(`${number}st`);
  });

  it.each([2, 22])("appends nd onto the number %s", (number) => {
    expect(ordinalDateNumber(number)).toBe(`${number}nd`);
  });

  it.each([3])("appends rd onto the number %s", (number) => {
    expect(ordinalDateNumber(number)).toBe(`${number}rd`);
  });
});
