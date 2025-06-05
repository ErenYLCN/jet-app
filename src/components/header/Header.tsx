import { type ReactNode } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router";
import styles from "./Header.module.css";
import IconButton from "../ui/icon/button/IconButton";

interface HeaderProps {
  headerActions?: ReactNode;
}

export default function Header({ headerActions }: HeaderProps) {
  const postcode = useAppSelector((state) => state.user.postcode);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <IconButton
            variant="logo"
            icon="erenbezorgd"
            onClick={handleLogoClick}
            description="Go to home"
          />
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
