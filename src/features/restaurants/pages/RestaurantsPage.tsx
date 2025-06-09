import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchRestaurantsStart } from "../../../store/slices/restaurant/restaurantsSlice";
import Page from "../../../components/page/Page";
import IconButton from "../../../components/ui/icon/button/IconButton";
import Icon from "../../../components/ui/icon/Icon";
import RestaurantSearchInput from "../components/search-input/RestaurantSearchInput";
import RestaurantList from "../components/list/RestaurantList";
import Spinner from "../../../components/ui/spinner/Spinner";
import RestaurantErrorMessage from "../components/error-message/RestaurantErrorMessage";
import Select from "../../../components/ui/select/Select";
import Switch from "../../../components/ui/switch/Switch";
import {
  useRestaurantListState,
  type SortOption,
} from "../hooks/list-state/useRestaurantListState";
import useModalState from "../../../hooks/modal-state/useModalState";
import type { Restaurant } from "../types/Restaurant";
import { processRestaurants } from "../utils/restaurantUtils";
import { RestaurantFilterRegistry } from "../strategies/filter/RestaurantFilterStrategy";
import { RestaurantSortStrategyRegistry } from "../strategies/sort/RestaurantSortStrategy";
import { SORT_SELECT_OPTIONS } from "../constants/restaurantConstants";
import styles from "./RestaurantsPage.module.css";

const RestaurantDetailModal = lazy(
  () => import("../components/detail-modal/RestaurantDetailModal")
);
const UserModal = lazy(
  () => import("../../../components/user/modal/UserModal")
);

function RestaurantsPage() {
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurants
  );
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    page,
    sort,
    openNow,
    isNew,
    freeDelivery,
    setSearchQuery,
    setPage,
    setSort,
    setOpenNow,
    setIsNew,
    setFreeDelivery,
  } = useRestaurantListState();
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

  const handleRefresh = useCallback(() => {
    dispatch(fetchRestaurantsStart());
  }, [dispatch]);

  const handleSearch = useCallback(
    (value: string) => {
      if (value.trim() === "") {
        return;
      }

      setSearchQuery(value.trim());
    },
    [setSearchQuery]
  );

  const handlePageChange = useCallback(
    (pageNumber: number) => {
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
    },
    [setPage]
  );

  const handleRestaurantClick = useCallback(
    (restaurant: Restaurant) => {
      setSelectedRestaurant(restaurant);
      openRestaurantDetailModal();
    },
    [openRestaurantDetailModal]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setSearchQuery("");
      }
    },
    [setSearchQuery]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSort(e.target.value as SortOption);
    },
    [setSort]
  );

  const sortRegistry = useMemo(() => new RestaurantSortStrategyRegistry(), []);
  const filterRegistry = useMemo(() => new RestaurantFilterRegistry(), []);
  const filterStrategies = useMemo(
    () =>
      filterRegistry.getStrategies({
        query: searchQuery,
        openNow,
        isNew,
        freeDelivery,
      }),
    [filterRegistry, searchQuery, openNow, isNew, freeDelivery]
  );
  const sortStrategy = useMemo(
    () => sortRegistry.getStrategy(sort),
    [sortRegistry, sort]
  );
  const filteredAndSortedRestaurants = useMemo(
    () => processRestaurants(restaurants, filterStrategies, sortStrategy),
    [restaurants, filterStrategies, sortStrategy]
  );

  return (
    <Page
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
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <RestaurantSearchInput
                customClassName={styles.searchInput}
                value={inputValue}
                onChange={handleInputChange}
                onSearch={handleSearch}
              />

              <Select
                label="Sort by"
                options={SORT_SELECT_OPTIONS}
                value={sort}
                onChange={handleSortChange}
                customClassName={styles.sortSelect}
              />
            </div>
          </div>

          <div className={styles.switchesContainer}>
            <div className={styles.switchGroup}>
              <Switch
                description="Filter by restaurants open now"
                value={openNow}
                onChange={setOpenNow}
              />
              <span className={styles.switchLabel}>Open Now</span>
            </div>

            <div className={styles.switchGroup}>
              <Switch
                description="Filter by new restaurants"
                value={isNew}
                onChange={setIsNew}
              />
              <span className={styles.switchLabel}>New</span>
            </div>

            <div className={styles.switchGroup}>
              <Switch
                description="Filter by restaurants with free delivery"
                value={freeDelivery}
                onChange={setFreeDelivery}
              />
              <span className={styles.switchLabel}>Free Delivery</span>
            </div>
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

        {!loading && !error && filteredAndSortedRestaurants.length > 0 && (
          <RestaurantList
            filteredRestaurants={filteredAndSortedRestaurants}
            currentPage={page}
            onPageChange={handlePageChange}
            onRestaurantClick={handleRestaurantClick}
          />
        )}

        {!loading &&
          !error &&
          restaurants.length > 0 &&
          filteredAndSortedRestaurants.length === 0 && (
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

      {isRestaurantDetailModalOpen && (
        <Suspense fallback={null}>
          <RestaurantDetailModal
            isOpen={isRestaurantDetailModalOpen}
            onClose={closeRestaurantDetailModal}
            restaurant={selectedRestaurant}
          />
        </Suspense>
      )}

      {isUserModalOpen && (
        <Suspense fallback={null}>
          <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} />
        </Suspense>
      )}
    </Page>
  );
}

export default RestaurantsPage;
