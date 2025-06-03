import { useSearchParams } from "react-router";

interface RestaurantListState {
  searchQuery: string;
  page: number;
}

interface RestaurantListActions {
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setMultiple: (updates: Partial<RestaurantListState>) => void;
}

export const useRestaurantListState = (): RestaurantListState &
  RestaurantListActions => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;

  const setSearchQuery = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const setPage = (pageNumber: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(pageNumber));
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

    setSearchParams(newParams);
  };

  return {
    searchQuery,
    page,
    setSearchQuery,
    setPage,
    setMultiple,
  };
};
