import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRestaurantsStart } from "../../store/slices/restaurantsSlice";
import Page from "../page/Page";
import IconButton from "../ui/icon-button/button/IconButton";
import Icon from "../ui/icon-button/Icon";
import RestaurantSearchInput from "../restaurant/search-input/RestaurantSearchInput";
import RestaurantList from "../restaurant/list/RestaurantList";
import Spinner from "../ui/spinner/Spinner";
import RestaurantDetailModal from "../restaurant/detail-modal/RestaurantDetailModal";
import RestaurantErrorMessage from "../restaurant/error-message/RestaurantErrorMessage";
import UserModal from "../user/modal/UserModal";
import { useRestaurantListState } from "../../hooks/restaurant-list-state/useRestaurantListState";
import useModalState from "../../hooks/modal-state/useModalState";
import type { Restaurant } from "../../models/Restaurant.model";

import styles from "./Home.module.css";

function Home() {
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurants
  );
  const dispatch = useAppDispatch();
  const { searchQuery, page, setSearchQuery, setPage } =
    useRestaurantListState();
  const [inputValue, setInputValue] = useState(searchQuery || "");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const {
    isOpen: isRestaurantDetailModalOpen,
    open: openRestaurantDetailModal,
    close: closeRestaurantDetailModal,
  } = useModalState();
  const {
    isOpen: isUserModalOpen,
    open: openUserModal,
    close: closeUserModal,
  } = useModalState();

  useEffect(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRestaurantsStart());
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);

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
    openRestaurantDetailModal();
  };

  // Filter restaurants based on search query
  const filteredRestaurants = searchQuery
    ? restaurants.filter(
        (restaurant) =>
          restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisines?.some((cuisine) =>
            cuisine.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : restaurants;

  return (
    <Page
      title="Restaurants Near You"
      headerActions={
        <IconButton
          onClick={openUserModal}
          size="lg"
          description="Open user menu"
        >
          <Icon name="hamburger" alt="Menu" width={24} height={24} />
        </IconButton>
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

        {error && (
          <RestaurantErrorMessage error={error} onRetry={handleRefresh} />
        )}

        {!loading && !error && filteredRestaurants.length > 0 && (
          <RestaurantList
            filteredRestaurants={filteredRestaurants}
            currentPage={page}
            onPageChange={handlePageChange}
            onRestaurantClick={handleRestaurantClick}
          />
        )}

        {!loading &&
          !error &&
          restaurants.length > 0 &&
          filteredRestaurants.length === 0 && (
            <p className={styles.emptyMessage}>
              No restaurants match your search for "{searchQuery}".
            </p>
          )}

        {!loading && !error && restaurants.length === 0 && (
          <p className={styles.emptyMessage}>
            No restaurants found for this postcode.
          </p>
        )}
      </div>

      <RestaurantDetailModal
        isOpen={isRestaurantDetailModalOpen}
        onClose={closeRestaurantDetailModal}
        restaurant={selectedRestaurant}
      />

      <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} />
    </Page>
  );
}

export default Home;
