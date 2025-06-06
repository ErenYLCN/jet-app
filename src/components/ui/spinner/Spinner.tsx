import cn from "../../../utils/class-names/classNames";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "small" | "large";
  customClassName?: string;
}

export default function Spinner({
  size = "large",
  customClassName,
}: SpinnerProps) {
  return (
    <div
      className={cn(styles.spinner, styles[size], customClassName)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
