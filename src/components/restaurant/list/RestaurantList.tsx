import RestaurantCard from "../card/RestaurantCard";
import type { Restaurant } from "../../../models/Restaurant.model";

import styles from "./RestaurantList.module.css";

interface RestaurantListProps {
  filteredRestaurants: Restaurant[];
}

function RestaurantList({ filteredRestaurants }: RestaurantListProps) {
  return (
    <ul className={styles.restaurantsList}>
      {filteredRestaurants.map((restaurant) => (
        <li className={styles.restaurantItem} key={restaurant.id}>
          <RestaurantCard
            customClassName="h-full"
            key={restaurant.id}
            restaurant={restaurant}
          />
        </li>
      ))}
    </ul>
  );
}

export default RestaurantList;
