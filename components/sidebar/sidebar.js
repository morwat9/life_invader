import styles from "./sidebar.module.scss";
import { useUserContext } from "../../context/user/user.context";
import Image from "next/image";
import { shareTechMono } from "../../utils/fonts";

export default function Sidebar() {
  const { userState } = useUserContext();

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["profile-picture"]}>
        <img src={userState.profilePicture} alt={"Profile picture"} />
      </div>
      <div className={styles["profile-container"]}>
        <span className={shareTechMono.className}>
          {userState.username}
        </span>
      </div>
    </div>
  );
}
