import React, { useEffect, useCallback } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { fetchRestaurantsStart } from "../../../../store/slices/restaurant/restaurantsSlice";
import { useRestaurantListState } from "../../hooks/list-state/useRestaurantListState";
import { useRestaurantProcessor } from "../../hooks/processor/useRestaurantProcessor";
import RestaurantList from "../list/RestaurantList";
import RestaurantErrorMessage from "../error-message/RestaurantErrorMessage";
import Spinner from "../../../../components/ui/spinner/Spinner";
import type { Restaurant } from "../../types/Restaurant";
import styles from "./RestaurantContent.module.css";

interface RestaurantContentProps {
  onRestaurantClick: (restaurant: Restaurant) => void;
}

const RestaurantContent: React.FC<RestaurantContentProps> = ({
  onRestaurantClick,
}) => {
  const dispatch = useAppDispatch();
  const { page, setPage } = useRestaurantListState();

  const {
    loading,
    error,
    processedRestaurants,
    searchQuery,
    totalRestaurants,
    filteredCount,
  } = useRestaurantProcessor();

  useEffect(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      setPage(pageNumber);
      setTimeout(() => {
        if (document.documentElement) {
          document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        } else if (document.body) {
          document.body.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 0);
    },
    [setPage]
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <RestaurantErrorMessage error={error} onRetry={handleRefresh} />;
  }

  if (processedRestaurants.length > 0) {
    return (
      <RestaurantList
        filteredRestaurants={processedRestaurants}
        currentPage={page}
        onPageChange={handlePageChange}
        onRestaurantClick={onRestaurantClick}
      />
    );
  }

  if (totalRestaurants > 0 && filteredCount === 0) {
    return (
      <p className={styles.emptyMessage}>
        No restaurants match your search for "{searchQuery}".
      </p>
    );
  }

  return (
    <p className={styles.emptyMessage}>
      No restaurants found for this postcode.
    </p>
  );
};

export default RestaurantContent;
