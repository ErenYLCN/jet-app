import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import IconButton from "./IconButton";

// Mock CSS module
jest.mock("./IconButton.module.css", () => ({
  iconButton: "iconButton",
  sm: "sm",
  md: "md",
  lg: "lg",
}));

describe("IconButton Component", () => {
  test("renders correctly with default props", () => {
    render(
      <IconButton description="Test button">
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("iconButton md");
    expect(button).not.toBeDisabled();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  test("renders with different sizes", () => {
    const { rerender } = render(
      <IconButton description="Small button" size="sm">
        <svg data-testid="icon" />
      </IconButton>
    );

    expect(screen.getByRole("button")).toHaveClass("sm");

    rerender(
      <IconButton description="Large button" size="lg">
        <svg data-testid="icon" />
      </IconButton>
    );

    expect(screen.getByRole("button")).toHaveClass("lg");
  });

  test("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton description="Click me" onClick={handleClick}>
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("is disabled when disabled prop is true", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton description="Disabled button" disabled onClick={handleClick}>
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
