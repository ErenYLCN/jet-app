import { type ReactNode } from "react";
import Header from "../header/Header";
import styles from "./Page.module.css";

interface PageProps {
  children: ReactNode;
  title?: string;
  headerActions?: ReactNode;
}

export default function Page({ children, title, headerActions }: PageProps) {
  return (
    <div className={styles.page}>
      <Header title={title} headerActions={headerActions} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
