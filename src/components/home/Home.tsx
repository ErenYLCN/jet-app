import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { increment, incrementAsync } from "../../store/slices/counterSlice";
import { fetchRestaurantsStart } from "../../store/slices/restaurantsSlice";
import cn from "../../utils/classNames";

import styles from "./Home.module.css";

function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const { restaurants, loading } = useAppSelector((state) => state.restaurants);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRestaurantsStart("CT12EH"));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && restaurants.length > 0) {
      console.log("Restaurants data:", restaurants);
    }
  }, [restaurants, loading]);

  return (
    <div className={cn(styles.app, "centered")}>
      <h1>Vite + React</h1>
      <div className={styles.card}>
        <button onClick={() => dispatch(increment())}>+1</button>
        <button onClick={() => dispatch(incrementAsync())}>async +1</button>
        <div>count is {count}</div>
      </div>
    </div>
  );
}

export default Home;
