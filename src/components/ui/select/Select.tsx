import cn from "../../../utils/class-names/classNames";
import Icon from "../icon/Icon";
import styles from "./Select.module.css";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  customClassName?: string;
  ref?: React.Ref<HTMLSelectElement>;
}

function Select({
  label,
  options,
  customClassName,
  disabled,
  ref,
  ...props
}: SelectProps) {
  return (
    <div className={cn(styles.selectWrapper, customClassName)}>
      <div className={styles.selectContainer}>
        <span className={styles.label}>{label}</span>
        <select
          ref={ref}
          className={styles.select}
          aria-label={label}
          disabled={disabled}
          name={label}
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

export default Select;
