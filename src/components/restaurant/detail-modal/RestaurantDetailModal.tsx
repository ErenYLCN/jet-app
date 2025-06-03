import Modal from "../../ui/modal/Modal";
import IconButton from "../../ui/icon-button/button/IconButton";
import type { Restaurant } from "../../../models/Restaurant.model";
import styles from "./RestaurantDetailModal.module.css";

interface RestaurantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
}

function RestaurantDetailModal({
  isOpen,
  onClose,
  restaurant,
}: RestaurantDetailModalProps) {
  if (!restaurant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>{restaurant.name || "Restaurant"}</h2>
          <IconButton
            onClick={onClose}
            description="Close modal"
            customClassName={styles.closeButton}
            icon="close"
          />
        </div>

        <div className={styles.header}>
          {restaurant.logoUrl && (
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name || "Restaurant"}
              className={styles.logo}
            />
          )}
          <div className={styles.info}>
            {restaurant.rating && (
              <div className={styles.rating}>
                <span className={styles.stars}>
                  ★ {restaurant.rating.starRating || 0}
                </span>
                <span className={styles.count}>
                  ({restaurant.rating.count || 0} reviews)
                </span>
              </div>
            )}
            {restaurant.cuisines && restaurant.cuisines.length > 0 && (
              <div className={styles.cuisines}>
                {restaurant.cuisines.map((cuisine, index) => (
                  <span key={index} className={styles.cuisine}>
                    {cuisine.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.details}>
          {restaurant.address && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Address</h3>
              <p className={styles.address}>
                {restaurant.address.firstLine}
                <br />
                {restaurant.address.city}, {restaurant.address.postalCode}
              </p>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Delivery Information</h3>
            <div className={styles.deliveryInfo}>
              {restaurant.deliveryEtaMinutes && (
                <div className={styles.deliveryItem}>
                  <span className={styles.label}>Delivery Time:</span>
                  <span className={styles.value}>
                    {restaurant.deliveryEtaMinutes.rangeLower}-
                    {restaurant.deliveryEtaMinutes.rangeUpper} minutes
                  </span>
                </div>
              )}
              {restaurant.deliveryCost !== undefined && (
                <div className={styles.deliveryItem}>
                  <span className={styles.label}>Delivery Cost:</span>
                  <span className={styles.value}>
                    £{restaurant.deliveryCost.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RestaurantDetailModal;
