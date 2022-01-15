import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react-native";

export const asyncRender = async (component) =>
  waitFor(() => {
    jest.clearAllMocks(); // clear mocks in case wait for had to run multiple interations
    return render(component);
  });

export const asyncPressEvent = async (button) => {
  expect(button).toBeTruthy();
  await act(async () => fireEvent.press(button));
};

export const getButtonByText = (screen, innerText) => {
  const buttons = screen.getAllByRole("button");
  return buttons.find((button) => within(button).queryByText(innerText));
};

export const getButtonByChildTestId = (screen, childTestId) => {
  const buttons = screen.getAllByRole("button");
  return buttons.find((button) => within(button).queryByTestId(childTestId));
};

export const buttonProps = (buttonComponent) =>
  buttonComponent.parent.parent.parent.parent.props;

export const silenceAllErrorLogs = () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
};

export const enableAllErrorLogs = () => {
  console.error?.mockRestore?.();
};
