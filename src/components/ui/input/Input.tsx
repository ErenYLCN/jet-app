import React, {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import cn from "../../../utils/class-names/classNames";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightActions?: ReactNode;
  label?: string;
  ref?: RefObject<HTMLInputElement | null>;
  customClassName?: string;
}

const Input: React.FC<InputProps> = ({
  leftIcon,
  rightActions,
  label,
  id,
  ref,
  customClassName,
  ...props
}) => {
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={cn(styles.inputWrapper, customClassName)}
    >
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <input
        ref={ref}
        id={id || inputId}
        className={styles.input}
        {...props}
        aria-label={label}
      />
      {rightActions && <div className={styles.actions}>{rightActions}</div>}
    </label>
  );
};

export default Input;
