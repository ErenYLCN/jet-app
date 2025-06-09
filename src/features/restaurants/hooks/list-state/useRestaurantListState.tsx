import { useEffect, useCallback } from "react";
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
  openNow: boolean;
  isNew: boolean;
  freeDelivery: boolean;
}

interface RestaurantListActions {
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setSort: (sort: SortOption) => void;
  setOpenNow: (openNow: boolean) => void;
  setIsNew: (isNew: boolean) => void;
  setFreeDelivery: (freeDelivery: boolean) => void;
}

export const useRestaurantListState = (): RestaurantListState &
  RestaurantListActions => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const sort = (searchParams.get("sort") as SortOption) || "bestMatch";
  const openNow = searchParams.get("openNow") === "true";
  const isNew = searchParams.get("isNew") === "true";
  const freeDelivery = searchParams.get("freeDelivery") === "true";

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

  const setSearchQuery = useCallback(
    (query: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (query) {
        newParams.set("q", query);
      } else {
        newParams.delete("q");
      }
      newParams.set("page", "1");
      newParams.delete("sort");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setPage = useCallback(
    (pageNumber: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(pageNumber));
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setSort = useCallback(
    (sortOption: SortOption) => {
      const newParams = new URLSearchParams(searchParams);
      if (sortOption === "bestMatch") {
        newParams.delete("sort");
      } else {
        newParams.set("sort", sortOption);
      }
      newParams.set("page", "1"); // Reset to first page when sorting changes
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setOpenNow = useCallback(
    (openNow: boolean) => {
      const newParams = new URLSearchParams(searchParams);
      if (openNow) {
        newParams.set("openNow", "true");
      } else {
        newParams.delete("openNow");
      }
      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setIsNew = useCallback(
    (isNew: boolean) => {
      const newParams = new URLSearchParams(searchParams);
      if (isNew) {
        newParams.set("isNew", "true");
      } else {
        newParams.delete("isNew");
      }
      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setFreeDelivery = useCallback(
    (freeDelivery: boolean) => {
      const newParams = new URLSearchParams(searchParams);
      if (freeDelivery) {
        newParams.set("freeDelivery", "true");
      } else {
        newParams.delete("freeDelivery");
      }
      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    searchQuery,
    page,
    sort,
    openNow,
    isNew,
    freeDelivery,
    setSearchQuery,
    setPage,
    setSort,
    setOpenNow,
    setIsNew,
    setFreeDelivery,
  };
};
