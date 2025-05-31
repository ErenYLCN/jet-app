import { type Restaurant } from "../../models/Restaurant.model";
import Card from "../ui/card/Card";
import styles from "./RestaurantCard.module.css";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const handleClick = () => {
    console.log(restaurant);
  };

  return (
    <Card onClick={handleClick}>
      <h1 className={styles.title}>{restaurant.name}</h1>
    </Card>
  );
}
