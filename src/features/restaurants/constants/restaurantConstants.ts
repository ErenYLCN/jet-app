import type { SortOption } from "../hooks/list-state/useRestaurantListState";

const SORT_SELECT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "bestMatch", label: "Best Match" },
  { value: "reviews", label: "Rating (High to Low)" },
  { value: "estimatedDeliveryTime", label: "Delivery Time" },
  { value: "minOrderAmount", label: "Min Order Amount" },
  { value: "deliveryCost", label: "Delivery Cost" },
];

export { SORT_SELECT_OPTIONS };
