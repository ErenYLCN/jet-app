import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Spinner from "./Spinner";

// Mock CSS module
jest.mock("./Spinner.module.css", () => ({
  spinner: "spinner",
  small: "small",
  large: "large",
  visuallyHidden: "visuallyHidden",
}));

describe("Spinner Component", () => {
  test("renders with default props", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(spinner).toHaveClass("spinner large");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with small size", () => {
    render(<Spinner size="small" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("spinner small");
    expect(spinner).not.toHaveClass("large");
  });

  test("renders with large size", () => {
    render(<Spinner size="large" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("spinner large");
    expect(spinner).not.toHaveClass("small");
  });

  test("applies custom className", () => {
    render(<Spinner customClassName="custom-spinner" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-spinner");
    expect(spinner).toHaveClass("spinner large"); // Should still have default classes
  });

  test("applies both size and custom className", () => {
    render(<Spinner size="small" customClassName="my-custom-class" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("spinner small my-custom-class");
  });

  test("has correct accessibility attributes", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");

    const hiddenText = screen.getByText("Loading...");
    expect(hiddenText).toHaveClass("visuallyHidden");
  });

  test("renders loading text for screen readers", () => {
    render(<Spinner />);

    // The loading text should be present but visually hidden
    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass("visuallyHidden");
  });
});
