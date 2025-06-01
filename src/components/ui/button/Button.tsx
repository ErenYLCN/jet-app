import cn from "../../../utils/classNames";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
  customClassName?: string;
  ref?: React.Ref<HTMLButtonElement>;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  children,
  left,
  right,
  customClassName,
  className,
  ref,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        customClassName,
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-live={"polite"}
      aria-atomic={true}
      {...props}
    >
      {left}
      {children}
      {right}
    </button>
  );
}
