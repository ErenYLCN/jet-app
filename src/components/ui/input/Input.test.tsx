import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import Input, { type InputProps } from "./Input";

// Mock CSS module
jest.mock("./Input.module.css", () => ({
  inputWrapper: "inputWrapper",
  input: "input",
  icon: "icon",
  actions: "actions",
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => `mock-id-${Math.random().toString(36).substr(2, 9)}`,
}));

// Test wrapper component to handle ref
const TestInput = (props: InputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return <Input ref={ref} {...props} />;
};

describe("Input Component", () => {
  test("renders correctly with basic props", () => {
    render(<TestInput label="Test input" placeholder="Enter text" />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-label", "Test input");
    expect(input).toHaveAttribute("placeholder", "Enter text");
  });

  test("renders with left icon", () => {
    render(
      <TestInput
        label="Search"
        leftIcon={<span data-testid="search-icon">🔍</span>}
      />
    );

    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("renders with right actions", () => {
    render(
      <TestInput
        label="Input with actions"
        rightActions={<button data-testid="clear-btn">Clear</button>}
      />
    );

    expect(screen.getByTestId("clear-btn")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("handles user input", async () => {
    const user = userEvent.setup();

    render(<TestInput label="Type here" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  test("generates unique id when not provided", () => {
    const { rerender } = render(<TestInput label="First input" />);
    const firstInput = screen.getByRole("textbox");
    const firstId = firstInput.getAttribute("id");

    rerender(<TestInput label="Second input" />);
    const secondInput = screen.getByRole("textbox");
    const secondId = secondInput.getAttribute("id");

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  test("uses provided id", () => {
    render(<TestInput id="custom-input" label="Custom ID input" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "custom-input");
  });
});
