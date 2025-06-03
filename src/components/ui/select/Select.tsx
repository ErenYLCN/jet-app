import { forwardRef } from "react";
import cn from "../../../utils/class-names/classNames";
import Icon from "../icon-button/Icon";
import styles from "./Select.module.css";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  customClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, customClassName, disabled, ...props }, ref) => {
    return (
      <div className={cn(styles.selectWrapper, customClassName)}>
        <div className={styles.selectContainer}>
          <label className={styles.label}>{label}</label>
          <select
            ref={ref}
            className={styles.select}
            aria-label={label}
            disabled={disabled}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles.iconContainer}>
            <Icon name="caret-down" alt="" width={16} height={16} />
          </div>
        </div>
      </div>
    );
  }
);

export default Select;
