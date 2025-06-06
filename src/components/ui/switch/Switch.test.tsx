import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Switch from "./Switch";

jest.mock("./Switch.module.css", () => ({
  switch: "switch",
  input: "input",
  label: "label",
  circle: "circle",
}));

describe("Switch Component", () => {
  test("renders correctly with required props", () => {
    render(<Switch description="Toggle setting" value={false} />);

    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeInTheDocument();
    expect(switchInput).toHaveAttribute("aria-label", "Toggle setting");
    expect(switchInput).not.toBeChecked();
  });

  test("renders as checked when value prop is true", () => {
    render(<Switch description="Toggle setting" value={true} />);

    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeChecked();
    expect(switchInput).toHaveAttribute("aria-checked", "true");
  });

  test("calls onChange when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Switch
        description="Toggle setting"
        value={false}
        onChange={handleChange}
      />
    );

    const switchInput = screen.getByRole("switch");
    await user.click(switchInput);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test("toggles between checked and unchecked states", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    const { rerender } = render(
      <Switch
        description="Toggle setting"
        value={false}
        onChange={handleChange}
      />
    );

    const switchInput = screen.getByRole("switch");

    await user.click(switchInput);
    expect(handleChange).toHaveBeenCalledWith(true);

    handleChange.mockClear();

    rerender(
      <Switch
        description="Toggle setting"
        value={true}
        onChange={handleChange}
      />
    );

    const checkedSwitchInput = screen.getByRole("switch");
    await user.click(checkedSwitchInput);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test("applies custom className", () => {
    const { container } = render(
      <Switch
        description="Toggle setting"
        value={false}
        customClassName="custom-switch"
      />
    );

    const switchContainer = container.firstChild;
    expect(switchContainer).toHaveClass("custom-switch");
  });

  test("passes through additional props to input", () => {
    render(
      <Switch
        description="Toggle setting"
        value={false}
        data-testid="custom-switch"
        disabled
      />
    );

    const switchInput = screen.getByTestId("custom-switch");
    expect(switchInput).toBeDisabled();
  });
});
