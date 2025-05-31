import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRestaurantsStart } from "../../store/slices/restaurantsSlice";
import RestaurantCard from "../restaurant-card/RestaurantCard";

import styles from "./Home.module.css";

function Home() {
  const { restaurants, loading } = useAppSelector((state) => state.restaurants);
  const { postcode } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && restaurants.length > 0) {
      console.log("Restaurants data:", restaurants);
    }
  }, [restaurants, loading]);

  return (
    <div className={styles.home}>
      <p>Current postcode: {postcode}</p>

      {loading && <p>Loading restaurants...</p>}

      {!loading && restaurants.length > 0 && (
        <div>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </li>
          ))}
        </div>
      )}

      {!loading && restaurants.length === 0 && <p>No restaurants found for this postcode.</p>}
    </div>
  );
}

export default Home;
