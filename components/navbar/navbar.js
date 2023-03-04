import styles from "./navbar.module.scss";
import { shareTechMono, firaSans } from "../../utils/fonts.js";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter()

  function signOut(){
    localStorage.removeItem("id")
    router.reload()
  }

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
          <span onClick={signOut}><span className={shareTechMono.className}>Logout</span></span>
        </div>
      </div>
    </div>
  );
}
