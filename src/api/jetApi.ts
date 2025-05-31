import axios from "axios";

// Created a proxy for the Just Eat API to avoid CORS issues (see vite.config.ts)
const BASE_URL = "/api/jet";
const DEFAULT_POSTCODE = "CT12EH";

const jetApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRestaurantsByPostcode = async (postcode: string = DEFAULT_POSTCODE) => {
  const response = await jetApi.get(`/discovery/uk/restaurants/enriched/bypostcode/${postcode}`);
  return response.data;
};

export default jetApi;
