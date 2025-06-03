// Utility function to access environment variables
// This makes it easier to mock in tests
export const getGoogleMapsApiKey = (): string => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
};
