import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

// Need to mock CSS modules
jest.mock("./Button.module.css", () => ({
  button: "button",
  primary: "primary",
  secondary: "secondary",
  sm: "sm",
  md: "md",
  lg: "lg",
  loading: "loading",
}));

// Mock the Spinner component
jest.mock("../spinner/Spinner", () => {
  return function MockSpinner({ size }: { size: string }) {
    return (
      <div data-testid="spinner" data-size={size}>
        Loading spinner
      </div>
    );
  };
});

describe("Button Component", () => {
  test("renders correctly with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("button primary md");
    expect(button).not.toBeDisabled();
  });

  test("renders with different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);

    let button = screen.getByRole("button", { name: /primary/i });
    expect(button).toHaveClass("primary");
    expect(button).not.toHaveClass("secondary");

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole("button", { name: /secondary/i });
    expect(button).toHaveClass("secondary");
    expect(button).not.toHaveClass("primary");
  });

  test("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);

    let button = screen.getByRole("button", { name: /small/i });
    expect(button).toHaveClass("sm");

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole("button", { name: /medium/i });
    expect(button).toHaveClass("md");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: /large/i });
    expect(button).toHaveClass("lg");
  });

  test("renders in loading state", () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole("button");
    const spinner = screen.getByTestId("spinner");

    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveClass("loading");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("data-size", "small");
    expect(screen.queryByText("Click me")).not.toBeInTheDocument();
  });

  test("renders in disabled state", () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  test("applies additional classes from customClassName", () => {
    render(<Button customClassName="custom-class">Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("custom-class");
  });

  test("renders with left and right content", () => {
    render(
      <Button
        left={<span data-testid="left-icon">←</span>}
        right={<span data-testid="right-icon">→</span>}
      >
        Click me
      </Button>
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("passes additional props to button element", () => {
    render(
      <Button type="submit" data-testid="submit-button" onClick={() => {}}>
        Submit
      </Button>
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("data-testid", "submit-button");
  });

  test("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not trigger onClick when disabled", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test("does not trigger onClick when in loading state", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} loading>
        Click me
      </Button>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
