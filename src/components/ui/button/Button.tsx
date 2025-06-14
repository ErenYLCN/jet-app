import cn from "../../../utils/class-names/classNames";
import styles from "./Button.module.css";
import Spinner from "../spinner/Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
  customClassName?: string;
  ref?: React.Ref<HTMLButtonElement | null>;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  children,
  left,
  right,
  customClassName,
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
        loading && styles.loading,
        customClassName
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-live={"polite"}
      aria-atomic={true}
      {...props}
    >
      {loading ? (
        <Spinner size="small" />
      ) : (
        <>
          {left}
          {children}
          {right}
        </>
      )}
    </button>
  );
}
