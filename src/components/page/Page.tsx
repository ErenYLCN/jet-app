import { type ReactNode } from "react";
import Header from "../header/Header";
import styles from "./Page.module.css";

interface PageProps {
  children: ReactNode;
  headerActions?: ReactNode;
}

export default function Page({ children, headerActions }: PageProps) {
  return (
    <div className={styles.page}>
      <Header headerActions={headerActions} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
