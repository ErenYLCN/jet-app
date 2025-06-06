import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Icon from "./Icon";

// Mock the SVG imports
jest.mock("../../../assets/svg/hamburger.svg", () => "hamburger.svg");
jest.mock("../../../assets/svg/close.svg", () => "close.svg");
jest.mock("../../../assets/svg/search.svg", () => "search.svg");
jest.mock("../../../assets/svg/caret-down.svg", () => "caret-down.svg");
jest.mock("../../../assets/svg/erenbezorgd.svg", () => "erenbezorgd.svg");

describe("Icon Component", () => {
  test("renders hamburger icon with default props", () => {
    render(<Icon name="hamburger" />);

    const icon = screen.getByRole("presentation");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "hamburger.svg");
    expect(icon).toHaveAttribute("alt", "");
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  test("renders close icon", () => {
    render(<Icon name="close" />);

    const icon = screen.getByRole("presentation");
    expect(icon).toHaveAttribute("src", "close.svg");
  });

  test("renders search icon", () => {
    render(<Icon name="search" />);

    const icon = screen.getByRole("presentation");
    expect(icon).toHaveAttribute("src", "search.svg");
  });

  test("renders caret-down icon", () => {
    render(<Icon name="caret-down" />);

    const icon = screen.getByRole("presentation");
    expect(icon).toHaveAttribute("src", "caret-down.svg");
  });

  test("renders erenbezorgd icon", () => {
    render(<Icon name="erenbezorgd" />);

    const icon = screen.getByRole("presentation");
    expect(icon).toHaveAttribute("src", "erenbezorgd.svg");
  });

  test("renders with custom alt text", () => {
    render(<Icon name="search" alt="Search icon" />);

    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("alt", "Search icon");
  });

  test("renders with custom dimensions", () => {
    render(<Icon name="hamburger" width={32} height={32} />);

    const icon = screen.getByRole("presentation");
    expect(icon).toHaveAttribute("width", "32");
    expect(icon).toHaveAttribute("height", "32");
  });

  test("renders with custom className", () => {
    render(<Icon name="close" customClassName="my-icon-class" />);

    const icon = screen.getByRole("presentation");
    expect(icon).toHaveClass("my-icon-class");
  });

  test("renders with all custom props", () => {
    render(
      <Icon
        name="erenbezorgd"
        alt="Company logo"
        width={48}
        height={48}
        customClassName="logo-icon"
      />
    );

    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("src", "erenbezorgd.svg");
    expect(icon).toHaveAttribute("alt", "Company logo");
    expect(icon).toHaveAttribute("width", "48");
    expect(icon).toHaveAttribute("height", "48");
    expect(icon).toHaveClass("logo-icon");
  });

  test("handles different icon names correctly", () => {
    const iconNames = [
      "hamburger",
      "close",
      "search",
      "caret-down",
      "erenbezorgd",
    ] as const;

    iconNames.forEach((iconName) => {
      const { unmount } = render(<Icon name={iconName} />);

      const icon = screen.getByRole("presentation");
      expect(icon).toHaveAttribute("src", `${iconName}.svg`);

      unmount();
    });
  });

  test("has proper image attributes for accessibility", () => {
    render(<Icon name="search" alt="Search for restaurants" />);

    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("alt", "Search for restaurants");
    // img elements should have role="img" by default
    expect(icon).toHaveAttribute("src");
  });

  test("renders without className when not provided", () => {
    render(<Icon name="hamburger" />);

    const icon = screen.getByRole("presentation");
    expect(icon).not.toHaveAttribute("class");
  });
});
