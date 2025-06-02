import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRestaurantsStart } from "../../store/slices/restaurantsSlice";
import Page from "../page/Page";
import Button from "../ui/button/Button";
import RestaurantSearchInput from "../restaurant/search-input/RestaurantSearchInput";
import RestaurantList from "../restaurant/list/RestaurantList";
import Spinner from "../ui/spinner/Spinner";
import { useSearchParamState } from "../../hooks/useSearchParamState";

import styles from "./Home.module.css";

function Home() {
  const { restaurants, loading } = useAppSelector((state) => state.restaurants);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useSearchParamState("q");
  const [inputValue, setInputValue] = useState(searchQuery || "");

  useEffect(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRestaurantsStart());
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
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
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <RestaurantSearchInput
              value={inputValue}
              onChange={(value) => {
                setInputValue(value);

                if (value === "") {
                  setSearchQuery("");
                }
              }}
              onSearch={handleSearch}
            />

            {/* TODO: Add a sorting dropdown */}
          </div>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <Spinner />
          </div>
        )}

        {!loading && filteredRestaurants.length > 0 && (
          <RestaurantList filteredRestaurants={filteredRestaurants} />
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
