import Button from "../../ui/button/Button";
import styles from "./RestaurantErrorMessage.module.css";

interface RestaurantErrorMessageProps {
  error: string;
  onRetry: () => void;
}

function RestaurantErrorMessage({ error, onRetry }: RestaurantErrorMessageProps) {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>
        Error loading restaurants: {error}
      </p>
      <Button onClick={onRetry} variant="primary" size="sm">
        Try Again
      </Button>
    </div>
  );
}

export default RestaurantErrorMessage;
