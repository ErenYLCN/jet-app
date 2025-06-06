import axios from "axios";
import type { Restaurant } from "../features/restaurants/types/Restaurant";
import type { RestaurantsApiResponse } from "./jetApi";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

import { getRestaurantsByPostcode } from "./jetApi";

describe("jetApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRestaurantsByPostcode", () => {
    const mockRestaurant: Restaurant = {
      id: "1",
      name: "Test Restaurant",
      logoUrl: "https://example.com/logo.jpg",
      rating: {
        starRating: 4.5,
        count: 100,
      },
      cuisines: [{ name: "Italian" }],
      deliveryEtaMinutes: {
        rangeLower: 30,
        rangeUpper: 45,
      },
      deliveryCost: 2.99,
      minimumDeliveryValue: 15.0,
      address: {
        firstLine: "123 Test Street",
        city: "London",
        postalCode: "SW1A 1AA",
        location: {
          type: "Point",
          coordinates: [-0.1276, 51.5074],
        },
      },
    };

    const mockResponse: RestaurantsApiResponse = {
      restaurants: [mockRestaurant],
    };

    test("should fetch restaurants by postcode successfully", async () => {
      const postcode = "SW1A1AA";

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await getRestaurantsByPostcode(postcode);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/discovery/uk/restaurants/enriched/bypostcode/${postcode}`
      );

      expect(result).toEqual(mockResponse);
      expect(result.restaurants).toHaveLength(1);
      expect(result.restaurants[0]).toEqual(mockRestaurant);
    });

    test("should make correct API call with postcode", async () => {
      const postcode = "SW1A1AA";

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await getRestaurantsByPostcode(postcode);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/discovery/uk/restaurants/enriched/bypostcode/${postcode}`
      );
    });

    test("should handle API error", async () => {
      const postcode = "SW1A1AA";
      const errorMessage = "Network Error";

      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(getRestaurantsByPostcode(postcode)).rejects.toThrow(
        errorMessage
      );
    });

    test("should handle empty restaurants response", async () => {
      const postcode = "SW1A1AA";
      const emptyResponse: RestaurantsApiResponse = {
        restaurants: [],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: emptyResponse });

      const result = await getRestaurantsByPostcode(postcode);

      expect(result).toEqual(emptyResponse);
      expect(result.restaurants).toHaveLength(0);
    });

    test("should handle multiple restaurants response", async () => {
      const postcode = "SW1A1AA";
      const secondRestaurant: Restaurant = {
        id: "2",
        name: "Another Restaurant",
        rating: {
          starRating: 4.2,
          count: 50,
        },
        cuisines: [{ name: "Chinese" }],
        deliveryCost: 1.99,
      };

      const multipleRestaurantsResponse: RestaurantsApiResponse = {
        restaurants: [mockRestaurant, secondRestaurant],
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: multipleRestaurantsResponse,
      });

      const result = await getRestaurantsByPostcode(postcode);

      expect(result).toEqual(multipleRestaurantsResponse);
      expect(result.restaurants).toHaveLength(2);
      expect(result.restaurants[0]).toEqual(mockRestaurant);
      expect(result.restaurants[1]).toEqual(secondRestaurant);
    });
  });
});
