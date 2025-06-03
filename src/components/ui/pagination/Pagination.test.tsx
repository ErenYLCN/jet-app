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
        showPageNumbers={true}
      />
    );

    const pageButton = screen.getByText("3");
    await user.click(pageButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test("shows ellipsis when there are many pages", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    // Should show ellipsis
    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  test("shows first page and ellipsis when current page is in middle", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    // Should show page 1, ellipsis, current page range, ellipsis, and last page
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  test("shows all pages when total is within maxVisiblePages", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  test("shows ellipsis only at end when current page is near start", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={20}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  test("shows ellipsis only at start when current page is near end", () => {
    render(
      <Pagination
        currentPage={19}
        totalPages={20}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("19")).toBeInTheDocument();
    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  test("current page button is disabled and has aria-current", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toBeDisabled();
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  test("non-current page buttons do not have aria-current", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    const otherPageButton = screen.getByText("2");
    expect(otherPageButton).not.toHaveAttribute("aria-current");
  });

  test("has proper aria labels", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showPageNumbers={true}
      />
    );

    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Pagination")).toBeInTheDocument();
  });
});
