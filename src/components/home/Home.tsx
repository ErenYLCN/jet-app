import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRestaurantsStart } from "../../store/slices/restaurantsSlice";
import RestaurantCard from "../restaurant-card/RestaurantCard";
import Page from "../page/Page";
import Button from "../ui/button/Button";

import styles from "./Home.module.css";

function Home() {
  const { restaurants, loading } = useAppSelector((state) => state.restaurants);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && restaurants.length > 0) {
      console.log("Restaurants data:", restaurants);
    }
  }, [restaurants, loading]);

  const handleRefresh = () => {
    dispatch(fetchRestaurantsStart());
  };

  return (
    <Page
      title="Restaurants Near You"
      headerActions={
        <Button onClick={handleRefresh} variant="secondary" size="sm">
          Refresh
        </Button>
      }
    >
      <div className={styles.content}>
        {loading && (
          <p className={styles.loadingMessage}>Loading restaurants...</p>
        )}

        {!loading && restaurants.length > 0 && (
          <ul className={styles.restaurantsList}>
            {restaurants.map((restaurant) => (
              <li className={styles.restaurantItem} key={restaurant.id}>
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              </li>
            ))}
          </ul>
        )}

        {!loading && restaurants.length === 0 && (
          <p className={styles.emptyMessage}>
            No restaurants found for this postcode.
          </p>
        )}
      </div>
    </Page>
  );
}

export default Home;
