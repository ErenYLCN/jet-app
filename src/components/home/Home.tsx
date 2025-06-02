import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRestaurantsStart } from "../../store/slices/restaurantsSlice";
import Page from "../page/Page";
import Button from "../ui/button/Button";
import RestaurantSearchInput from "../restaurant/search-input/RestaurantSearchInput";
import RestaurantList from "../restaurant/list/RestaurantList";
import Spinner from "../ui/spinner/Spinner";
import RestaurantDetailModal from "../restaurant/detail-modal/RestaurantDetailModal";
import { useSearchParamState } from "../../hooks/useSearchParamState";
import useModalState from "../../hooks/useModalState";
import type { Restaurant } from "../../models/Restaurant.model";

import styles from "./Home.module.css";

function Home() {
  const { restaurants, loading } = useAppSelector((state) => state.restaurants);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useSearchParamState("q");
  // TODO: Manage page number with query parameter
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(searchQuery || "");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModalState();

  useEffect(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleRefresh = () => {
    dispatch(fetchRestaurantsStart());
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    setTimeout(() => {
      // Try multiple scroll methods for better compatibility
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      } else if (document.body) {
        document.body.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 0);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    openModal();
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
          <RestaurantList
            filteredRestaurants={filteredRestaurants}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onRestaurantClick={handleRestaurantClick}
          />
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

      <RestaurantDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        restaurant={selectedRestaurant}
      />
    </Page>
  );
}

export default Home;
