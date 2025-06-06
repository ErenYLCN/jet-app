import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import RestaurantCard from "./RestaurantCard";
import type { Restaurant } from "../../../features/restaurants/types/Restaurant";

// Mock CSS module
jest.mock("./RestaurantCard.module.css", () => ({
  card: "card",
  logoContainer: "logoContainer",
  logo: "logo",
  content: "content",
  name: "name",
  infoPair: "infoPair",
  rating: "rating",
  starIcon: "starIcon",
  ratingValue: "ratingValue",
  ratingCount: "ratingCount",
  cuisines: "cuisines",
  details: "details",
  deliveryTime: "deliveryTime",
  deliveryFee: "deliveryFee",
  deliveryFeeFree: "deliveryFeeFree",
  minOrder: "minOrder",
}));

describe("RestaurantCard Component", () => {
  const mockRestaurant: Restaurant = {
    id: "1",
    name: "Test Restaurant",
    logoUrl: "https://example.com/logo.jpg",
    rating: {
      starRating: 4.5,
      count: 150,
    },
    cuisines: [{ name: "Italian" }, { name: "Pizza" }],
    deliveryEtaMinutes: {
      rangeLower: 30,
      rangeUpper: 45,
    },
    deliveryCost: 2.99,
    minimumDeliveryValue: 15.0,
  };

  test("renders restaurant card with all information", () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(150+)")).toBeInTheDocument();
    expect(screen.getByText("Italian, Pizza")).toBeInTheDocument();
    expect(screen.getByText("🕐 30-45 min")).toBeInTheDocument();
    expect(screen.getByText("🚴 €2.99 Delivery")).toBeInTheDocument();
    expect(screen.getByText("💰 €15.00 min")).toBeInTheDocument();
  });

  test("renders restaurant logo with correct attributes", () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    const logo = screen.getByAltText("Test Restaurant logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://example.com/logo.jpg");
  });

  test("handles restaurant with free delivery", () => {
    const freeDeliveryRestaurant: Restaurant = {
      ...mockRestaurant,
      deliveryCost: 0,
    };

    render(<RestaurantCard restaurant={freeDeliveryRestaurant} />);

    expect(screen.getByText("🚴 Free delivery")).toBeInTheDocument();
  });

  test("handles restaurant with no minimum order", () => {
    const noMinRestaurant: Restaurant = {
      ...mockRestaurant,
      minimumDeliveryValue: 0,
    };

    render(<RestaurantCard restaurant={noMinRestaurant} />);

    expect(screen.getByText("💰 No min. order")).toBeInTheDocument();
  });

  test("handles restaurant without cuisines", () => {
    const noCuisineRestaurant: Restaurant = {
      ...mockRestaurant,
      cuisines: undefined,
    };

    render(<RestaurantCard restaurant={noCuisineRestaurant} />);

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(screen.queryByText("Italian, Pizza")).not.toBeInTheDocument();
  });

  test("handles restaurant with null delivery cost", () => {
    const nullDeliveryCostRestaurant: Restaurant = {
      ...mockRestaurant,
      deliveryCost: null as any,
    };

    render(<RestaurantCard restaurant={nullDeliveryCostRestaurant} />);

    expect(screen.queryByText(/Delivery/)).not.toBeInTheDocument();
  });

  test("calls onClick when card is clicked", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(
      <RestaurantCard restaurant={mockRestaurant} onClick={mockOnClick} />
    );

    const card = screen.getByRole("button");
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("handles keyboard navigation with Enter key", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(
      <RestaurantCard restaurant={mockRestaurant} onClick={mockOnClick} />
    );

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("handles keyboard navigation with Space key", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(
      <RestaurantCard restaurant={mockRestaurant} onClick={mockOnClick} />
    );

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard(" ");

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("ignores other key presses", async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(
      <RestaurantCard restaurant={mockRestaurant} onClick={mockOnClick} />
    );

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Escape}");

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test("applies custom className", () => {
    render(
      <RestaurantCard
        restaurant={mockRestaurant}
        customClassName="custom-card-class"
      />
    );

    const card = screen.getByRole("button");
    expect(card).toHaveClass("custom-card-class");
  });

  test("does not call onClick when no onClick is provided", async () => {
    const user = userEvent.setup();

    render(<RestaurantCard restaurant={mockRestaurant} />);

    const card = screen.getByRole("button");
    await user.click(card);

    // Should not throw any errors
    expect(card).toBeInTheDocument();
  });

  test("has correct accessibility attributes", () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  test("formats rating correctly with decimals", () => {
    const restaurantWithDecimalRating: Restaurant = {
      ...mockRestaurant,
      rating: {
        starRating: 4.7,
        count: 89,
      },
    };

    render(<RestaurantCard restaurant={restaurantWithDecimalRating} />);

    expect(screen.getByText("4.7")).toBeInTheDocument();
    expect(screen.getByText("(89+)")).toBeInTheDocument();
  });

  test("handles empty cuisines array", () => {
    const emptyCuisinesRestaurant: Restaurant = {
      ...mockRestaurant,
      cuisines: [],
    };

    render(<RestaurantCard restaurant={emptyCuisinesRestaurant} />);

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    // Should not show any cuisine text
    expect(screen.queryByText(",")).not.toBeInTheDocument();
  });

  test("handles single cuisine", () => {
    const singleCuisineRestaurant: Restaurant = {
      ...mockRestaurant,
      cuisines: [{ name: "Mexican" }],
    };

    render(<RestaurantCard restaurant={singleCuisineRestaurant} />);

    expect(screen.getByText("Mexican")).toBeInTheDocument();
    expect(screen.queryByText(",")).not.toBeInTheDocument();
  });

  test("handles delivery time with same lower and upper bounds", () => {
    const sameTimeRestaurant: Restaurant = {
      ...mockRestaurant,
      deliveryEtaMinutes: {
        rangeLower: 30,
        rangeUpper: 30,
      },
    };

    render(<RestaurantCard restaurant={sameTimeRestaurant} />);

    expect(screen.getByText("🕐 30-30 min")).toBeInTheDocument();
  });

  test("handles missing delivery time bounds", () => {
    const missingBoundsRestaurant: Restaurant = {
      ...mockRestaurant,
      deliveryEtaMinutes: {
        rangeLower: undefined as any,
        rangeUpper: undefined as any,
      },
    };

    render(<RestaurantCard restaurant={missingBoundsRestaurant} />);

    expect(screen.getByText("🕐 0-0 min")).toBeInTheDocument();
  });
});
