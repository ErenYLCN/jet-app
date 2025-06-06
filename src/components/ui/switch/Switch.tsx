import cn from "../../../utils/class-names/classNames";
import styles from "./Switch.module.css";
import { useId } from "react";

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "role" | "value" | "onChange"
  > {
  description: string;
  value: boolean;
  onChange?: (checked: boolean) => void;
  customClassName?: string;
}

export default function Switch({
  description,
  value,
  onChange,
  customClassName,
  ...props
}: SwitchProps) {
  const switchId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Switch changed:", event.target.checked);

    onChange?.(event.target.checked);
  };

  return (
    <div className={cn(styles.switch, customClassName)}>
      <input
        id={switchId}
        type="checkbox"
        role="switch"
        aria-checked={value}
        aria-label={description}
        checked={value}
        onChange={handleChange}
        className={cn(styles.input, "sr-only")}
        {...props}
      />
      <label htmlFor={switchId} className={styles.label}>
        <span className={styles.circle}></span>
      </label>
    </div>
  );
}
