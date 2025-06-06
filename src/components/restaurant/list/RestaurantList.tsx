import { useEffect } from "react";
import RestaurantCard from "../card/RestaurantCard";
import Pagination from "../../ui/pagination/Pagination";
import type { Restaurant } from "../../../features/restaurants/types/Restaurant";

import styles from "./RestaurantList.module.css";

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

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages && onPageChange) {
      onPageChange(1);
    }
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className={styles.restaurantListContainer}>
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

export default RestaurantList;
