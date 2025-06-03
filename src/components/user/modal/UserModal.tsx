import { useAppSelector } from "../../../store/hooks";
import Modal from "../../ui/modal/Modal";
import IconButton from "../../ui/icon-button/button/IconButton";

import styles from "./UserModal.module.css";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UserModal({ isOpen, onClose }: UserModalProps) {
  const { postcode } = useAppSelector((state) => state.user);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>User Information</h2>
          <IconButton
            onClick={onClose}
            description="Close modal"
            className={styles.closeButton}
            icon="close"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>Postcode</label>
            <span className={styles.value}>{postcode}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UserModal;
