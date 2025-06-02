import { type ReactNode } from "react";
import { useAppSelector } from "../../store/hooks";
import styles from "./Header.module.css";

interface HeaderProps {
  title?: string;
  headerActions?: ReactNode;
}

export default function Header({ title, headerActions }: HeaderProps) {
  const postcode = useAppSelector((state) => state.user.postcode);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          {title && <h1 className={styles.title}>{title}</h1>}
        </div>

        <div className={styles.centerSection}>
          {postcode && (
            <span className={styles.address}>Postcode: {postcode}</span>
          )}
        </div>

        <div className={styles.rightSection}>
          {headerActions && (
            <div className={styles.headerActions}>{headerActions}</div>
          )}
        </div>
      </div>
    </header>
  );
}
