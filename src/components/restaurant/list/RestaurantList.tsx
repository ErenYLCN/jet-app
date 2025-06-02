import RestaurantCard from "../card/RestaurantCard";
import Pagination from "../../ui/pagination/Pagination";
import type { Restaurant } from "../../../models/Restaurant.model";

import styles from "./RestaurantList.module.css";

interface RestaurantListProps {
  filteredRestaurants: Restaurant[];
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

function RestaurantList({
  filteredRestaurants,
  itemsPerPage = 12,
  currentPage = 1,
  onPageChange,
}: RestaurantListProps) {
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  return (
    <div className={styles.restaurantListContainer}>
      <ul className={styles.restaurantsList}>
        {currentRestaurants.map((restaurant) => (
          <li className={styles.restaurantItem} key={restaurant.id}>
            <RestaurantCard customClassName="h-full" restaurant={restaurant} />
          </li>
        ))}
      </ul>

      {onPageChange && (
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
