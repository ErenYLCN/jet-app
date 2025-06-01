import { type ReactNode } from "react";
import styles from "./Page.module.css";

interface PageProps {
  children: ReactNode;
  title?: string;
  headerActions?: ReactNode;
}

export default function Page({ children, title, headerActions }: PageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {headerActions && (
            <div className={styles.headerActions}>{headerActions}</div>
          )}
        </div>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
