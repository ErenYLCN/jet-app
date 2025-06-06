import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RestaurantMapView from "./RestaurantMapView";
import type { Restaurant } from "../../../features/restaurants/types/Restaurant";
import { useJsApiLoader } from "@react-google-maps/api";

// Mock Google Maps global object
const mockGoogle = {
  maps: {
    Size: class Size {
      // @ts-expect-error: Mock implementation
      constructor(public width: number, public height: number) {}
    },
    Point: class Point {
      // @ts-expect-error: Mock implementation
      constructor(public x: number, public y: number) {}
    },
  },
};

// Set up global google object
(global as any).google = mockGoogle;
(globalThis as any).google = mockGoogle;

// Also ensure it's available on window for browser-like environment
if (typeof window !== "undefined") {
  (window as any).google = mockGoogle;
}

// Mock the env utility function
jest.mock("../../../utils/env/env", () => ({
  getGoogleMapsApiKey: jest.fn(() => "test-api-key"),
}));

// Mock CSS modules
jest.mock("./RestaurantMapView.module.css", () => ({
  mapContainer: "mapContainer",
  errorContainer: "errorContainer",
  errorMessage: "errorMessage",
  loadingContainer: "loadingContainer",
  loadingMessage: "loadingMessage",
  addressInfo: "addressInfo",
  restaurantName: "restaurantName",
  address: "address",
}));

// Mock Google Maps API with simple implementations
jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: jest.fn(),
  GoogleMap: jest.fn(({ children }) => (
    <div data-testid="google-map">{children}</div>
  )),
  Marker: jest.fn(() => <div data-testid="marker" />),
}));

const mockUseJsApiLoader = useJsApiLoader as jest.MockedFunction<
  typeof useJsApiLoader
>;

describe("RestaurantMapView", () => {
  const mockRestaurant: Restaurant = {
    id: "1",
    name: "Test Restaurant",
    address: {
      firstLine: "123 Main St",
      city: "Test City",
      postalCode: "12345",
      location: {
        type: "Point",
        coordinates: [-74.006, 40.7128],
      },
    },
  };

  const mockRestaurantWithoutCoordinates: Restaurant = {
    id: "2",
    name: "Restaurant Without Location",
    address: {
      firstLine: "456 Other St",
      city: "Other City",
      postalCode: "67890",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading State", () => {
    test("shows loading message when map is loading", () => {
      mockUseJsApiLoader.mockReturnValue({
        isLoaded: false,
        loadError: undefined,
      });

      render(<RestaurantMapView restaurant={mockRestaurant} />);

      expect(screen.getByText("Loading map...")).toBeInTheDocument();
      expect(screen.getByText("Loading map...")).toHaveClass("loadingMessage");
    });
  });

  describe("Error States", () => {
    test("shows error message when map fails to load", () => {
      mockUseJsApiLoader.mockReturnValue({
        isLoaded: false,
        loadError: new Error("API Key error"),
      });

      render(<RestaurantMapView restaurant={mockRestaurant} />);

      expect(
        screen.getByText(
          "Error loading Google Maps. Please check your API key and try again."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Error loading Google Maps. Please check your API key and try again."
        )
      ).toHaveClass("errorMessage");
    });

    test("shows error message when restaurant has no coordinates", () => {
      mockUseJsApiLoader.mockReturnValue({
        isLoaded: true,
        loadError: undefined,
      });

      render(
        <RestaurantMapView restaurant={mockRestaurantWithoutCoordinates} />
      );

      expect(
        screen.getByText(
          "Location information is not available for this restaurant."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Location information is not available for this restaurant."
        )
      ).toHaveClass("errorMessage");
    });

    test("shows error message when restaurant has no address", () => {
      mockUseJsApiLoader.mockReturnValue({
        isLoaded: true,
        loadError: undefined,
      });

      const restaurantWithoutAddress: Restaurant = {
        id: "3",
        name: "Restaurant Without Address",
      };

      render(<RestaurantMapView restaurant={restaurantWithoutAddress} />);

      expect(
        screen.getByText(
          "Location information is not available for this restaurant."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Successful Map Rendering", () => {
    beforeEach(() => {
      mockUseJsApiLoader.mockReturnValue({
        isLoaded: true,
        loadError: undefined,
      });
    });

    test("renders map container when loaded successfully", () => {
      render(<RestaurantMapView restaurant={mockRestaurant} />);

      expect(screen.getByTestId("google-map")).toBeInTheDocument();
      expect(screen.getByTestId("marker")).toBeInTheDocument();
    });

    test("displays restaurant address info when showAddressInfo is true", () => {
      render(<RestaurantMapView restaurant={mockRestaurant} />);

      expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
      expect(
        screen.getByText("123 Main St, Test City 12345")
      ).toBeInTheDocument();
      expect(screen.getByText("Test Restaurant")).toHaveClass("restaurantName");
      expect(screen.getByText("123 Main St, Test City 12345")).toHaveClass(
        "address"
      );
    });

    test("handles restaurant without city", () => {
      const restaurantWithoutCity: Restaurant = {
        ...mockRestaurant,
        address: {
          firstLine: "123 Main St",
          postalCode: "12345",
          location: {
            type: "Point",
            coordinates: [-74.006, 40.7128],
          },
        },
      };

      render(<RestaurantMapView restaurant={restaurantWithoutCity} />);

      expect(screen.getByText("123 Main St 12345")).toBeInTheDocument();
    });

    test("handles restaurant without postal code", () => {
      const restaurantWithoutPostalCode: Restaurant = {
        ...mockRestaurant,
        address: {
          firstLine: "123 Main St",
          city: "Test City",
          location: {
            type: "Point",
            coordinates: [-74.006, 40.7128],
          },
        },
      };

      render(<RestaurantMapView restaurant={restaurantWithoutPostalCode} />);

      expect(screen.getByText("123 Main St, Test City")).toBeInTheDocument();
    });

    test("uses default title when restaurant name is not provided", () => {
      const restaurantWithoutName: Restaurant = {
        id: "4",
        address: {
          firstLine: "123 Main St",
          city: "Test City",
          postalCode: "12345",
          location: {
            type: "Point",
            coordinates: [-74.006, 40.7128],
          },
        },
      };

      render(<RestaurantMapView restaurant={restaurantWithoutName} />);

      expect(screen.getByTestId("google-map")).toBeInTheDocument();
      expect(screen.getByTestId("marker")).toBeInTheDocument();
    });
  });

  describe("Custom Dimensions", () => {
    test("uses custom height and width when provided", () => {
      mockUseJsApiLoader.mockReturnValue({
        isLoaded: true,
        loadError: undefined,
      });

      render(
        <RestaurantMapView
          restaurant={mockRestaurant}
          height="500px"
          width="80%"
        />
      );

      expect(screen.getByTestId("google-map")).toBeInTheDocument();
    });

    test("uses default dimensions when not provided", () => {
      mockUseJsApiLoader.mockReturnValue({
        isLoaded: true,
        loadError: undefined,
      });

      render(<RestaurantMapView restaurant={mockRestaurant} />);

      expect(screen.getByTestId("google-map")).toBeInTheDocument();
    });
  });
});
