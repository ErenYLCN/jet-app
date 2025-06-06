import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import RestaurantDetailModal from "./RestaurantDetailModal";
import type { Restaurant } from "../../../features/restaurants/types/Restaurant";

// Mock CSS modules
jest.mock("./RestaurantDetailModal.module.css", () => ({
  container: "container",
  modalHeader: "modalHeader",
  title: "title",
  closeButton: "closeButton",
  mapSection: "mapSection",
  header: "header",
  logo: "logo",
  info: "info",
  rating: "rating",
  stars: "stars",
  count: "count",
  cuisines: "cuisines",
  cuisine: "cuisine",
  details: "details",
  section: "section",
  sectionTitle: "sectionTitle",
  address: "address",
  deliveryInfo: "deliveryInfo",
  deliveryItem: "deliveryItem",
  label: "label",
  value: "value",
}));

// Mock Modal component
jest.mock("../../ui/modal/Modal", () => {
  return function MockModal({
    isOpen,
    onClose,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" onClick={onClose}>
        {children}
      </div>
    );
  };
});

// Mock IconButton component
jest.mock("../../ui/icon/button/IconButton", () => {
  return function MockIconButton({
    onClick,
    description,
    customClassName,
    icon,
  }: {
    onClick: () => void;
    description: string;
    customClassName?: string;
    icon: string;
  }) {
    return (
      <button
        onClick={onClick}
        className={customClassName}
        aria-label={description}
        data-icon={icon}
        data-testid="close-button"
      >
        {description}
      </button>
    );
  };
});

// Mock RestaurantMapView component
jest.mock("../map-view/RestaurantMapView", () => {
  return function MockRestaurantMapView({
    restaurant,
    height,
  }: {
    restaurant: Restaurant;
    height: string;
  }) {
    return (
      <div data-testid="map-view" data-height={height}>
        Map for {restaurant.name}
      </div>
    );
  };
});

describe("RestaurantDetailModal Component", () => {
  const mockOnClose = jest.fn();

  const mockRestaurant: Restaurant = {
    id: "1",
    name: "Test Restaurant",
    logoUrl: "https://example.com/logo.jpg",
    rating: {
      starRating: 4.5,
      count: 120,
    },
    cuisines: [{ name: "Italian" }, { name: "Pizza" }],
    address: {
      firstLine: "123 Main Street",
      city: "Test City",
      postalCode: "12345",
    },
    deliveryEtaMinutes: {
      rangeLower: 30,
      rangeUpper: 45,
    },
    deliveryCost: 2.99,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when restaurant is null", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={null}
      />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  test("renders nothing when isOpen is false", () => {
    render(
      <RestaurantDetailModal
        isOpen={false}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  test("renders modal with restaurant details when open", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
  });

  test("renders restaurant name as title", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    const title = screen.getByText("Test Restaurant");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("title");
  });

  test("renders close button", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    const closeButton = screen.getByTestId("close-button");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("data-icon", "close");
  });

  test("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("renders restaurant map with correct height", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    const mapView = screen.getByTestId("map-view");
    expect(mapView).toBeInTheDocument();
    expect(mapView).toHaveAttribute("data-height", "300px");
  });

  test("renders restaurant logo when logoUrl is provided", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    const logo = screen.getByAltText("Test Restaurant");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://example.com/logo.jpg");
    expect(logo).toHaveClass("logo");
  });

  test("does not render logo when logoUrl is not provided", () => {
    const restaurantWithoutLogo = { ...mockRestaurant, logoUrl: undefined };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithoutLogo}
      />
    );

    expect(screen.queryByAltText("Test Restaurant")).not.toBeInTheDocument();
  });

  test("renders rating information", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.getByText("★ 4.5")).toBeInTheDocument();
    expect(screen.getByText("(120 reviews)")).toBeInTheDocument();
  });

  test("renders cuisines", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Pizza")).toBeInTheDocument();
  });

  test("renders address information", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText(/123 Main Street/)).toBeInTheDocument();
    expect(screen.getByText(/Test City.*12345/)).toBeInTheDocument();
  });

  test("renders delivery information", () => {
    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.getByText("Delivery Information")).toBeInTheDocument();
    expect(screen.getByText("Delivery Time:")).toBeInTheDocument();
    expect(screen.getByText("30-45 minutes")).toBeInTheDocument();
    expect(screen.getByText("Delivery Cost:")).toBeInTheDocument();
    expect(screen.getByText("£2.99")).toBeInTheDocument();
  });

  test("handles restaurant with minimal data", () => {
    const minimalRestaurant: Restaurant = {
      id: "2",
      name: "Minimal Restaurant",
    };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={minimalRestaurant}
      />
    );

    expect(screen.getByText("Minimal Restaurant")).toBeInTheDocument();
    expect(screen.queryByText("Address")).not.toBeInTheDocument();
    expect(screen.queryByText("Delivery Time:")).not.toBeInTheDocument();
  });

  test("uses fallback title when restaurant name is empty", () => {
    const restaurantWithoutName = { ...mockRestaurant, name: "" };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithoutName}
      />
    );

    expect(screen.getByText("Restaurant")).toBeInTheDocument();
  });

  test("handles restaurant without rating", () => {
    const restaurantWithoutRating = { ...mockRestaurant, rating: undefined };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithoutRating}
      />
    );

    expect(screen.queryByText(/★/)).not.toBeInTheDocument();
    expect(screen.queryByText(/reviews/)).not.toBeInTheDocument();
  });

  test("handles restaurant without cuisines", () => {
    const restaurantWithoutCuisines = {
      ...mockRestaurant,
      cuisines: undefined,
    };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithoutCuisines}
      />
    );

    expect(screen.queryByText("Italian")).not.toBeInTheDocument();
    expect(screen.queryByText("Pizza")).not.toBeInTheDocument();
  });

  test("handles restaurant with empty cuisines array", () => {
    const restaurantWithEmptyCuisines = { ...mockRestaurant, cuisines: [] };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithEmptyCuisines}
      />
    );

    expect(screen.queryByText("Italian")).not.toBeInTheDocument();
  });

  test("handles rating with zero values", () => {
    const restaurantWithZeroRating = {
      ...mockRestaurant,
      rating: { starRating: 0, count: 0 },
    };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithZeroRating}
      />
    );

    expect(screen.getByText("★ 0")).toBeInTheDocument();
    expect(screen.getByText("(0 reviews)")).toBeInTheDocument();
  });

  test("handles delivery cost of zero", () => {
    const restaurantWithFreeDelivery = {
      ...mockRestaurant,
      deliveryCost: 0,
    };

    render(
      <RestaurantDetailModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={restaurantWithFreeDelivery}
      />
    );

    expect(screen.getByText("£0.00")).toBeInTheDocument();
  });
});
