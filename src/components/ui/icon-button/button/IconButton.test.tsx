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

// Mock Icon component
jest.mock("../Icon", () => {
  return function MockIcon({
    name,
    alt,
    width = 24,
    height = 24,
    customClassName,
  }: {
    name: string;
    alt?: string;
    width?: number;
    height?: number;
    customClassName?: string;
  }) {
    return (
      <img
        src={`mock-${name}-icon.svg`}
        alt={alt}
        width={width}
        height={height}
        className={customClassName}
        data-testid={`icon-${name}`}
      />
    );
  };
});

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

  test("handles Enter key press", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton description="Keyboard button" onClick={handleClick}>
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("handles Space key press", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton description="Keyboard button" onClick={handleClick}>
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard(" ");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not trigger onClick on keyboard when disabled", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton description="Disabled button" disabled onClick={handleClick}>
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(handleClick).not.toHaveBeenCalled();
  });

  test("calls custom onKeyDown handler", async () => {
    const handleKeyDown = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton description="Custom keydown" onKeyDown={handleKeyDown}>
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("a");

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
});
