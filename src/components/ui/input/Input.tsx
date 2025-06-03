import React, {
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
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(styles.inputWrapper, customClassName)}
    >
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <input
        ref={ref}
        id={inputId}
        className={styles.input}
        {...props}
        aria-label={label}
      />
      {rightActions && <div className={styles.actions}>{rightActions}</div>}
    </label>
  );
};

export default Input;
