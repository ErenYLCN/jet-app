import { forwardRef } from "react";
import cn from "../../../../utils/class-names/classNames";
import Icon, { type IconName } from "../Icon";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  description: string;
  children?: React.ReactNode;
  icon?: IconName;
  customClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
  size?: "sm" | "md" | "lg";
  variant?: "standart" | "logo";
  disabled?: boolean;
}

const IconButton = forwardRef<HTMLSpanElement, IconButtonProps>(
  (
    {
      description,
      children,
      icon,
      customClassName,
      onClick,
      onKeyDown,
      size = "md",
      disabled = false,
      variant = "standart",
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
        className={cn(
          styles.iconButton,
          styles[size],
          customClassName,
          styles[variant]
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {icon ? (
          <Icon
            name={icon}
            alt={description}
            width={variant === "logo" ? 160 : undefined}
            height={variant === "logo" ? 60 : undefined}
          />
        ) : (
          children
        )}
      </span>
    );
  }
);

export default IconButton;
