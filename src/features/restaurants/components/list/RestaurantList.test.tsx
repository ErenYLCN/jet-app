import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import RestaurantList from "./RestaurantList";
import type { Restaurant } from "../../types/Restaurant";

// Mock CSS modules
jest.mock("./RestaurantList.module.css", () => ({
  restaurantListContainer: "restaurantListContainer",
  restaurantsList: "restaurantsList",
  restaurantItem: "restaurantItem",
}));

// Mock RestaurantCard component
jest.mock("../card/RestaurantCard", () => {
  return function MockRestaurantCard({
    restaurant,
    customClassName,
    onClick,
  }: {
    restaurant: Restaurant;
    customClassName?: string;
    onClick?: () => void;
  }) {
    return (
      <div
        className={customClassName}
        onClick={onClick}
        data-testid={`restaurant-card-${restaurant.id}`}
      >
        {restaurant.name}
      </div>
    );
  };
});

// Mock Pagination component
jest.mock("../../../../components/ui/pagination/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) {
    return (
      <div data-testid="pagination">
        <span data-testid="current-page">{currentPage}</span>
        <span data-testid="total-pages">{totalPages}</span>
        <button
          data-testid="next-page"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };
});

describe("RestaurantList Component", () => {
  const mockRestaurants: Restaurant[] = [
    { id: "1", name: "Restaurant 1" },
    { id: "2", name: "Restaurant 2" },
    { id: "3", name: "Restaurant 3" },
    { id: "4", name: "Restaurant 4" },
    { id: "5", name: "Restaurant 5" },
    { id: "6", name: "Restaurant 6" },
    { id: "7", name: "Restaurant 7" },
    { id: "8", name: "Restaurant 8" },
    { id: "9", name: "Restaurant 9" },
    { id: "10", name: "Restaurant 10" },
    { id: "11", name: "Restaurant 11" },
    { id: "12", name: "Restaurant 12" },
    { id: "13", name: "Restaurant 13" },
  ];

  const mockOnPageChange = jest.fn();
  const mockOnRestaurantClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders list of restaurants", () => {
    const restaurants = mockRestaurants.slice(0, 3);

    render(
      <RestaurantList
        filteredRestaurants={restaurants}
        currentPage={1}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    expect(screen.getByTestId("restaurant-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("restaurant-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("restaurant-card-3")).toBeInTheDocument();
  });

  test("displays correct number of restaurants per page", () => {
    render(
      <RestaurantList
        filteredRestaurants={mockRestaurants}
        currentPage={1}
        itemsPerPage={5}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    // Should show first 5 restaurants
    expect(screen.getByTestId("restaurant-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("restaurant-card-5")).toBeInTheDocument();
    expect(screen.queryByTestId("restaurant-card-6")).not.toBeInTheDocument();
  });

  test("displays correct restaurants for second page", () => {
    render(
      <RestaurantList
        filteredRestaurants={mockRestaurants}
        currentPage={2}
        itemsPerPage={5}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    // Should show restaurants 6-10
    expect(screen.queryByTestId("restaurant-card-5")).not.toBeInTheDocument();
    expect(screen.getByTestId("restaurant-card-6")).toBeInTheDocument();
    expect(screen.getByTestId("restaurant-card-10")).toBeInTheDocument();
    expect(screen.queryByTestId("restaurant-card-11")).not.toBeInTheDocument();
  });

  test("shows pagination when onPageChange is provided", () => {
    render(
      <RestaurantList
        filteredRestaurants={mockRestaurants}
        currentPage={1}
        itemsPerPage={5}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("3"); // 13 items / 5 per page = 3 pages
  });

  test("does not show pagination when onPageChange is not provided", () => {
    render(
      <RestaurantList
        filteredRestaurants={mockRestaurants}
        currentPage={1}
        itemsPerPage={5}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  test("calls onRestaurantClick when restaurant card is clicked", async () => {
    const user = userEvent.setup();
    const restaurants = mockRestaurants.slice(0, 3);

    render(
      <RestaurantList
        filteredRestaurants={restaurants}
        currentPage={1}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    const restaurantCard = screen.getByTestId("restaurant-card-2");
    await user.click(restaurantCard);

    expect(mockOnRestaurantClick).toHaveBeenCalledWith(restaurants[1]);
  });

  test("does not call onRestaurantClick when not provided", async () => {
    const user = userEvent.setup();
    const restaurants = mockRestaurants.slice(0, 3);

    render(
      <RestaurantList
        filteredRestaurants={restaurants}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );

    const restaurantCard = screen.getByTestId("restaurant-card-1");
    await user.click(restaurantCard);

    // Should not throw an error
    expect(mockOnRestaurantClick).not.toHaveBeenCalled();
  });

  test("uses default itemsPerPage when not provided", () => {
    render(
      <RestaurantList
        filteredRestaurants={mockRestaurants}
        currentPage={1}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    // Default is 12 items per page, should show first 12
    expect(screen.getByTestId("restaurant-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("restaurant-card-12")).toBeInTheDocument();
    expect(screen.queryByTestId("restaurant-card-13")).not.toBeInTheDocument();
  });

  test("uses default currentPage when not provided", () => {
    render(
      <RestaurantList
        filteredRestaurants={mockRestaurants}
        itemsPerPage={5}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    // Should show first page (restaurants 1-5)
    expect(screen.getByTestId("restaurant-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("restaurant-card-5")).toBeInTheDocument();
    expect(screen.queryByTestId("restaurant-card-6")).not.toBeInTheDocument();
  });

  test("handles empty restaurant list", () => {
    render(
      <RestaurantList
        filteredRestaurants={[]}
        currentPage={1}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    expect(screen.queryByTestId(/restaurant-card-/)).not.toBeInTheDocument();
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  test("resets to page 1 when current page exceeds total pages", () => {
    const restaurants = mockRestaurants.slice(0, 5); // 5 restaurants = 1 page with itemsPerPage=12

    render(
      <RestaurantList
        filteredRestaurants={restaurants}
        currentPage={3} // Exceeds total pages
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test("passes correct props to RestaurantCard", () => {
    const restaurants = mockRestaurants.slice(0, 1);

    render(
      <RestaurantList
        filteredRestaurants={restaurants}
        currentPage={1}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    const restaurantCard = screen.getByTestId("restaurant-card-1");
    expect(restaurantCard).toHaveClass("h-full");
  });

  test("handles pagination interaction", async () => {
    const user = userEvent.setup();

    render(
      <RestaurantList
        filteredRestaurants={mockRestaurants}
        currentPage={1}
        itemsPerPage={5}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    const nextButton = screen.getByTestId("next-page");
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("renders correct semantic structure", () => {
    const restaurants = mockRestaurants.slice(0, 3);

    render(
      <RestaurantList
        filteredRestaurants={restaurants}
        currentPage={1}
        onPageChange={mockOnPageChange}
        onRestaurantClick={mockOnRestaurantClick}
      />
    );

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });
});
