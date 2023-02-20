import { firaSans } from "../../utils/fonts";
import { useState } from "react";
import axios from "axios";
import styles from "./comment.module.scss";

export default function Comment({ comment, userState }) {
  const [liked, setLiked] = useState(
    comment.likes.includes(userState.id) ? true : false
  );
  const [likes, setLikes] = useState(comment.likes.length);

  async function handleLike() {
    try {
      if (!liked) {
        const result = await axios.put(
          `http://localhost:3000/likes/comment-add/${comment._id}`,
          { id: userState.id }
        );
        setLiked(true);
        setLikes(likes + 1);
      } else {
        const result = await axios.put(
          `http://localhost:3000/likes/comment-remove/${comment._id}`,
          { id: userState.id }
        );
        setLiked(false);
        setLikes(likes - 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles["comment-wrapper"]} key={comment._id}>
      <div className={styles["profile-picture-container"]}>
        <img src={comment.author.profilePicture} />
      </div>
      <div className={styles["comment-body"]}>
        <div className={styles["comment-content"]}>
          <span className={firaSans.className}>{comment.body}</span>
        </div>
        <div className={styles["comment-interaction"]} onClick={handleLike}>
          <div className={styles["like-count"]}>
            <span>{likes > 0 ? likes : ""}</span>
          </div>
          <span className={firaSans.className}>
            {liked ? "Liked!" : "Like "}
          </span>
        </div>
      </div>
    </div>
  );
}
