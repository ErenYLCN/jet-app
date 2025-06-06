import cn from "../../../../utils/class-names/classNames";
import type { Restaurant } from "../../types/Restaurant";
import styles from "./RestaurantCard.module.css";

interface RestaurantCardProps {
  restaurant: Restaurant;
  customClassName?: string;
  onClick?: () => void;
}

export default function RestaurantCard({
  restaurant,
  customClassName,
  onClick,
}: RestaurantCardProps) {
  const handleClick = () => {
    onClick?.();
  };

  const formatDeliveryTime = () => {
    const { rangeLower, rangeUpper } = restaurant.deliveryEtaMinutes || {};
    return `${rangeLower || 0}-${rangeUpper || 0} min`;
  };

  const formatDeliveryFee = () => {
    return restaurant.deliveryCost === 0
      ? "Free delivery"
      : `€${restaurant.deliveryCost?.toFixed(2)} Delivery`;
  };

  const formatCuisines = () => {
    return restaurant.cuisines?.map((cuisine) => cuisine.name).join(", ") || "";
  };

  const formatMinOrder = () => {
    return restaurant.minimumDeliveryValue === 0
      ? "No min. order"
      : `€${restaurant.minimumDeliveryValue?.toFixed(2)} min`;
  };

  return (
    <div
      className={cn(styles.card, customClassName)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div className={styles.logoContainer}>
        <img
          src={restaurant.logoUrl}
          alt={`${restaurant.name} logo`}
          className={styles.logo}
        />
      </div>

      <div className={styles.content}>
        <h3 className={cn(styles.name, "truncate")}>{restaurant.name}</h3>

        <div className={styles.infoPair}>
          <div className={styles.rating}>
            <span className={styles.starIcon}>★</span>
            <span className={styles.ratingValue}>
              {restaurant.rating?.starRating?.toFixed(1)}
            </span>
            <span className={styles.ratingCount}>
              ({restaurant.rating?.count}+)
            </span>
          </div>
          {restaurant.cuisines && (
            <span className={styles.cuisines}>{formatCuisines()}</span>
          )}
        </div>

        <div className={styles.details}>
          {restaurant.deliveryEtaMinutes && (
            <span className={styles.deliveryTime}>
              🕐 {formatDeliveryTime()}
            </span>
          )}
          {restaurant.deliveryCost !== null && (
            <span
              className={
                restaurant.deliveryCost === 0
                  ? styles.deliveryFeeFree
                  : styles.deliveryFee
              }
            >
              🚴 {formatDeliveryFee()}
            </span>
          )}
          {restaurant.minimumDeliveryValue !== null && (
            <span className={styles.minOrder}>💰 {formatMinOrder()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
