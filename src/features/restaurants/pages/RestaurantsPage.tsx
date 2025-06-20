import { useState, useCallback, lazy, Suspense } from "react";
import Page from "../../../components/page/Page";
import IconButton from "../../../components/ui/icon/button/IconButton";
import Icon from "../../../components/ui/icon/Icon";
import RestaurantFilters from "../components/filters/RestaurantFilters";
import RestaurantContent from "../components/content/RestaurantContent";
import useModalState from "../../../hooks/modal-state/useModalState";
import type { Restaurant } from "../types/Restaurant";
import styles from "./RestaurantsPage.module.css";

const RestaurantDetailModal = lazy(
  () => import("../components/detail-modal/RestaurantDetailModal")
);
const UserModal = lazy(
  () => import("../../../components/user/modal/UserModal")
);

function RestaurantsPage() {
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

  const handleRestaurantClick = useCallback(
    (restaurant: Restaurant) => {
      setSelectedRestaurant(restaurant);
      openRestaurantDetailModal();
    },
    [openRestaurantDetailModal]
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
        <RestaurantFilters />
        <RestaurantContent onRestaurantClick={handleRestaurantClick} />
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
