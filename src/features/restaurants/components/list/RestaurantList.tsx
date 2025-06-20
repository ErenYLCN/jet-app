import { useEffect, memo } from "react";
import RestaurantCard from "../card/RestaurantCard";
import styles from "./RestaurantList.module.css";
import Pagination from "../../../../components/ui/pagination/Pagination";
import type { Restaurant } from "../../types/Restaurant";

interface RestaurantListProps {
  filteredRestaurants: Restaurant[];
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onRestaurantClick?: (restaurant: Restaurant) => void;
}

function RestaurantList({
  filteredRestaurants,
  itemsPerPage = 12,
  currentPage = 1,
  onPageChange,
  onRestaurantClick,
}: RestaurantListProps) {
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const startRange = filteredRestaurants.length > 0 ? startIndex + 1 : 0;
  const endRange = Math.min(endIndex, filteredRestaurants.length);
  const totalCount = filteredRestaurants.length;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages && onPageChange) {
      onPageChange(1);
    }
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className={styles.restaurantListContainer}>
      {totalCount > 0 && (
        <div className={styles.resultsLabel}>
          Showing {startRange}-{endRange} of {totalCount} restaurant
          {totalCount !== 1 ? "s" : ""}
        </div>
      )}

      <ul className={styles.restaurantsList}>
        {currentRestaurants.map((restaurant) => (
          <li className={styles.restaurantItem} key={restaurant.id}>
            <RestaurantCard
              customClassName="h-full"
              restaurant={restaurant}
              onClick={() => onRestaurantClick?.(restaurant)}
            />
          </li>
        ))}
      </ul>

      {onPageChange && currentRestaurants.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default memo(RestaurantList);
