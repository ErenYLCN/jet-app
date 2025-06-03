import Modal from "../../ui/modal/Modal";
import IconButton from "../../ui/icon-button/IconButton";
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
          <h2 className={styles.title}>{restaurant.name}</h2>
          <IconButton
            onClick={onClose}
            size="sm"
            description="Close modal"
            className={styles.closeButton}
          >
            <img
              src="/src/assets/close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>

        <div className={styles.header}>
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className={styles.logo}
          />
          <div className={styles.info}>
            <div className={styles.rating}>
              <span className={styles.stars}>
                ★ {restaurant.rating.starRating}
              </span>
              <span className={styles.count}>
                ({restaurant.rating.count} reviews)
              </span>
            </div>
            <div className={styles.cuisines}>
              {restaurant.cuisines.map((cuisine, index) => (
                <span key={index} className={styles.cuisine}>
                  {cuisine.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Address</h3>
            <p className={styles.address}>
              {restaurant.address.firstLine}
              <br />
              {restaurant.address.city}, {restaurant.address.postalCode}
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Delivery Information</h3>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryItem}>
                <span className={styles.label}>Delivery Time:</span>
                <span className={styles.value}>
                  {restaurant.deliveryEtaMinutes.rangeLower}-
                  {restaurant.deliveryEtaMinutes.rangeUpper} minutes
                </span>
              </div>
              <div className={styles.deliveryItem}>
                <span className={styles.label}>Delivery Cost:</span>
                <span className={styles.value}>
                  £{restaurant.deliveryCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RestaurantDetailModal;
