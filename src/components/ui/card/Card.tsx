import cn from "../../../utils/classNames";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  customClassName?: string;
  onClick?: () => void;
}

export default function Card({ children, customClassName, onClick }: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component className={cn(styles.card, customClassName)} onClick={onClick}>
      {children}
    </Component>
  );
}
