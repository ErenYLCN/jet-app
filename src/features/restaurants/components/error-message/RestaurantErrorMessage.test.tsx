import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import RestaurantErrorMessage from "./RestaurantErrorMessage";

// Mock CSS modules
jest.mock("./RestaurantErrorMessage.module.css", () => ({
  errorContainer: "errorContainer",
  errorMessage: "errorMessage",
}));

// Mock Button component
jest.mock("../../../../components/ui/button/Button", () => {
  return function MockButton({
    children,
    onClick,
    variant,
    size,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
    size: string;
  }) {
    return (
      <button
        onClick={onClick}
        data-variant={variant}
        data-size={size}
        data-testid="retry-button"
      >
        {children}
      </button>
    );
  };
});

describe("RestaurantErrorMessage Component", () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders error message correctly", () => {
    render(
      <RestaurantErrorMessage
        error="Network connection failed"
        onRetry={mockOnRetry}
      />
    );

    expect(
      screen.getByText("Error loading restaurants: Network connection failed")
    ).toBeInTheDocument();
  });

  test("renders retry button with correct props", () => {
    render(
      <RestaurantErrorMessage error="API timeout" onRetry={mockOnRetry} />
    );

    const retryButton = screen.getByTestId("retry-button");
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveTextContent("Try Again");
    expect(retryButton).toHaveAttribute("data-variant", "primary");
    expect(retryButton).toHaveAttribute("data-size", "sm");
  });

  test("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <RestaurantErrorMessage error="Server error" onRetry={mockOnRetry} />
    );

    const retryButton = screen.getByTestId("retry-button");
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  test("handles empty error message", () => {
    render(<RestaurantErrorMessage error="" onRetry={mockOnRetry} />);

    expect(screen.getByText(/Error loading restaurants:/)).toBeInTheDocument();
  });

  test("handles long error message", () => {
    const longError =
      "This is a very long error message that might wrap to multiple lines and should still be displayed correctly without breaking the layout";

    render(<RestaurantErrorMessage error={longError} onRetry={mockOnRetry} />);

    expect(
      screen.getByText(`Error loading restaurants: ${longError}`)
    ).toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    const { container } = render(
      <RestaurantErrorMessage error="Test error" onRetry={mockOnRetry} />
    );

    const errorContainer = container.firstChild;
    expect(errorContainer).toHaveClass("errorContainer");

    const errorMessage = screen.getByText(
      "Error loading restaurants: Test error"
    );
    expect(errorMessage).toHaveClass("errorMessage");
  });

  test("multiple retry button clicks work correctly", async () => {
    const user = userEvent.setup();

    render(
      <RestaurantErrorMessage
        error="Intermittent error"
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByTestId("retry-button");

    await user.click(retryButton);
    await user.click(retryButton);
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(3);
  });

  test("component structure is correct", () => {
    render(<RestaurantErrorMessage error="Test error" onRetry={mockOnRetry} />);

    const container = screen.getByText(
      "Error loading restaurants: Test error"
    ).parentElement;
    const button = screen.getByTestId("retry-button");

    expect(container).toContainElement(button);
    expect(container).toHaveClass("errorContainer");
  });
});
