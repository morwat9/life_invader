import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";
import styles from "./layout.module.scss";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
          <div className={styles["left"]}>
            <Sidebar />
          </div>
          <div className={styles["right"]}>{children}</div>
        </div>
      </div>
    </div>
  );
}
