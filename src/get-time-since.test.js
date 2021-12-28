import { getTimeSince } from "./get-time-since";

describe("get-time-since", () => {
  it("returns zero for all time units when the start time and end time match", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-01T00:00:10")
      )
    ).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 10,
    });
  });

  it("returns 1 second when the start time is 00:00:00 and the end time is 00:00:01", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-01T00:00:01")
      )
    ).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 1,
    });
  });

  it("returns 59 seconds when the start time is 00:00:00 and the end time is 00:00:59", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-01T00:00:59")
      )
    ).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 59,
    });
  });

  it("returns 1 minute & 1 second when the start time is 00:00:00 and the end time is 00:01:01", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-01T00:01:01")
      )
    ).toEqual({
      days: 0,
      hours: 0,
      minutes: 1,
      seconds: 1,
    });
  });

  it("returns 59 minutes & 59 seconds when the start time is 00:00:00 and the end time is 00:59:59", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-01T00:59:59")
      )
    ).toEqual({
      days: 0,
      hours: 0,
      minutes: 59,
      seconds: 59,
    });
  });

  it("returns 1 hour, 1 minute & 1 second when the start time is 00:00:00 and the end time is 01:01:01", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-01T01:01:01")
      )
    ).toEqual({
      days: 0,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
  });

  it("returns 23 hours, 59 minutes & 59 seconds when the start time is 00:00:00 and the end time is 23:59:59", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-01T23:59:59")
      )
    ).toEqual({
      days: 0,
      hours: 23,
      minutes: 59,
      seconds: 59,
    });
  });

  it("returns 1 day, 1 hour, 1 minute & 1 second when the start time is 2021-01-01T00:00:00 and the end time is 2021-01-02T01:01:01", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-02T01:01:01")
      )
    ).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
  });

  it("returns 6 days, 23 hours, 59 minutes & 59 seconds when the start time is 2021-01-01T00:00:00 and the end time is 2021-01-07T23:59:59", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2021-01-07T23:59:59")
      )
    ).toEqual({
      days: 6,
      hours: 23,
      minutes: 59,
      seconds: 59,
    });
  });

  it("returns 365 days when the start time is 2021-01-01T00:00:00 and the end time is 2022-01-01T00:00:00", () => {
    expect(
      getTimeSince(
        new Date("2021-01-01T00:00:00"),
        new Date("2022-01-01T00:00:00")
      )
    ).toEqual({
      days: 365,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it("returns positive values for all units when the start date is in the future", () => {
    expect(
      getTimeSince(
        new Date("2021-01-07T23:59:59"),
        new Date("2021-01-01T00:00:00")
      )
    ).toEqual({
      days: 6,
      hours: 23,
      minutes: 59,
      seconds: 59,
    });
  });
});
