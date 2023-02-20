import styles from "./navbar.module.scss";
import { shareTechMono, firaSans } from "../../utils/fonts.js";

export default function Navbar() {
  return (
    <div className={styles["wrapper"]}>
      <div className={styles["navbar"]}>
        <div className={styles["brand"]}>
          <span className={shareTechMono.className}>l_i</span>
        </div>
        <div className={styles["tools"]}>
          <span className={shareTechMono.className}>Your_Profile</span>
          <span className={shareTechMono.className}>Friends</span>
          <span className={shareTechMono.className}>Notifications</span>
        </div>
      </div>
    </div>
  );
}
