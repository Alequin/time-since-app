import React from "react";
import { App } from "./App";
import { asyncRender, getButtonByChildTestId } from "./test-utils";

describe("App", () => {
  it("displays an add button", async () => {
    const screen = await asyncRender(<App />);

    expect(getButtonByChildTestId(screen, "plusIcon")).toBeDefined();
  });
});
