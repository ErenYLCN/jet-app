import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRestaurantsStart } from "../../store/slices/restaurantsSlice";
import RestaurantCard from "../restaurant/card/RestaurantCard";
import Page from "../page/Page";
import Button from "../ui/button/Button";
import RestaurantSearchInput from "../restaurant/search-input/RestaurantSearchInput";
import { useSearchParamState } from "../../hooks/useSearchParamState";

import styles from "./Home.module.css";

function Home() {
  const { restaurants, loading } = useAppSelector((state) => state.restaurants);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useSearchParamState("q");

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

  // Filter restaurants based on search query
  const filteredRestaurants = searchQuery
    ? restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisines.some((cuisine) =>
            cuisine.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : restaurants;

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
        <RestaurantSearchInput value={searchQuery} onChange={setSearchQuery} />

        {loading && (
          <p className={styles.loadingMessage}>Loading restaurants...</p>
        )}

        {!loading && filteredRestaurants.length > 0 && (
          <ul className={styles.restaurantsList}>
            {filteredRestaurants.map((restaurant) => (
              <li className={styles.restaurantItem} key={restaurant.id}>
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              </li>
            ))}
          </ul>
        )}

        {!loading &&
          restaurants.length > 0 &&
          filteredRestaurants.length === 0 && (
            <p className={styles.emptyMessage}>
              No restaurants match your search for "{searchQuery}".
            </p>
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
