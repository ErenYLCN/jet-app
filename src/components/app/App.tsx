import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { increment, incrementAsync } from "../../store/slices/counterSlice";
import cn from "../../utils/classNames";

import styles from "./App.module.css";

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

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

export default App;
