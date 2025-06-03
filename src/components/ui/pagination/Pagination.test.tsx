import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";
import type { ButtonProps } from "../button/Button";

// Mock CSS module
jest.mock("./Pagination.module.css", () => ({
  pagination: "pagination",
  navButton: "navButton",
  pageNumbers: "pageNumbers",
  ellipsis: "ellipsis",
  pageButton: "pageButton",
  active: "active",
}));

// Mock Button component
jest.mock("../button/Button", () => {
  return function MockButton({
    children,
    onClick,
    disabled,
    className,
    "aria-label": ariaLabel,
    "aria-current": ariaCurrent,
  }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
      >
        {children}
      </button>
    );
  };
});

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders navigation buttons", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  test("does not render when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("disables Previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  test("disables Next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  test("calls onPageChange when Previous is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByText("Previous");
    await user.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange when Next is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test("renders page numbers when showPageNumbers is true", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("calls onPageChange when page number is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const pageButton = screen.getByText("3");
    await user.click(pageButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });
});
