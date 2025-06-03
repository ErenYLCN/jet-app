import cn from "../../../utils/class-names/classNames";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "small" | "large";
  className?: string;
}

export default function Spinner({ size = "large", className }: SpinnerProps) {
  return (
    <div
      className={cn(styles.spinner, styles[size], className)}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.visuallyHidden}>Loading...</span>
    </div>
  );
}
