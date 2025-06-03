import { forwardRef } from "react";
import cn from "../../../utils/class-names/classNames";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  description: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const IconButton = forwardRef<HTMLSpanElement, IconButtonProps>(
  (
    {
      description,
      children,
      className,
      onClick,
      onKeyDown,
      size = "md",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled && onClick) {
          onClick(e as unknown as React.MouseEvent<HTMLSpanElement>);
        }
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (!disabled && onClick) {
        onClick(e);
      }
    };

    return (
      <span
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={description}
        aria-disabled={disabled}
        className={cn(styles.iconButton, styles[size], className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </span>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
