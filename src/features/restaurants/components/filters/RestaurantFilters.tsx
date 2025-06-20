import React, { useState, useCallback } from "react";
import RestaurantSearchInput from "../search-input/RestaurantSearchInput";
import Select from "../../../../components/ui/select/Select";
import Switch from "../../../../components/ui/switch/Switch";
import { SORT_SELECT_OPTIONS } from "../../constants/restaurantConstants";
import {
  useRestaurantListState,
  type SortOption,
} from "../../hooks/list-state/useRestaurantListState";
import styles from "./RestaurantFilters.module.css";

const RestaurantFilters: React.FC = () => {
  const {
    searchQuery,
    sort,
    openNow,
    isNew,
    freeDelivery,
    setSearchQuery,
    setSort,
    setOpenNow,
    setIsNew,
    setFreeDelivery,
  } = useRestaurantListState();

  const [inputValue, setInputValue] = useState(searchQuery || "");

  const handleSearch = useCallback(
    (value: string) => {
      if (value.trim() === "") return;
      setSearchQuery(value.trim());
    },
    [setSearchQuery]
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

  return (
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
  );
};

export default RestaurantFilters;
