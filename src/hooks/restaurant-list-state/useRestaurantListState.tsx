import { useEffect } from "react";
import { useSearchParams } from "react-router";

export type SortOption =
  | "bestMatch"
  | "reviews"
  | "estimatedDeliveryTime"
  | "minOrderAmount"
  | "deliveryCost";

interface RestaurantListState {
  searchQuery: string;
  page: number;
  sort: SortOption;
}

interface RestaurantListActions {
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setSort: (sort: SortOption) => void;
  setMultiple: (updates: Partial<RestaurantListState>) => void;
}

export const useRestaurantListState = (): RestaurantListState &
  RestaurantListActions => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const sort = (searchParams.get("sort") as SortOption) || "bestMatch";

  // Validate and clean up query parameters on initial load
  useEffect(() => {
    const currentPageParam = searchParams.get("page");
    const currentSortParam = searchParams.get("sort");
    const validSortOptions: SortOption[] = [
      "bestMatch",
      "reviews",
      "estimatedDeliveryTime",
      "minOrderAmount",
      "deliveryCost",
    ];

    let needsUpdate = false;
    const newParams = new URLSearchParams(searchParams);

    if (currentPageParam !== null) {
      const pageNumber = Number(currentPageParam);
      if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
        newParams.delete("page");
        needsUpdate = true;
      }
    }

    if (
      currentSortParam !== null &&
      !validSortOptions.includes(currentSortParam as SortOption)
    ) {
      newParams.delete("sort");
      needsUpdate = true;
    }

    if (needsUpdate) {
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  const setSearchQuery = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    newParams.set("page", "1");
    newParams.delete("sort");
    setSearchParams(newParams);
  };

  const setPage = (pageNumber: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(pageNumber));
    setSearchParams(newParams);
  };

  const setSort = (sortOption: SortOption) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortOption === "bestMatch") {
      newParams.delete("sort");
    } else {
      newParams.set("sort", sortOption);
    }
    newParams.set("page", "1"); // Reset to first page when sorting changes
    setSearchParams(newParams);
  };

  const setMultiple = (updates: Partial<RestaurantListState>) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.searchQuery !== undefined) {
      if (updates.searchQuery) {
        newParams.set("q", updates.searchQuery);
      } else {
        newParams.delete("q");
      }
    }

    if (updates.page !== undefined) {
      newParams.set("page", String(updates.page));
    }

    if (updates.sort !== undefined) {
      if (updates.sort === "bestMatch") {
        newParams.delete("sort");
      } else {
        newParams.set("sort", updates.sort);
      }
    }

    setSearchParams(newParams);
  };

  return {
    searchQuery,
    page,
    sort,
    setSearchQuery,
    setPage,
    setSort,
    setMultiple,
  };
};
