import styles from "./post.module.scss";
import { firaSans, shareTechMono, unbounded } from "../../utils/fonts";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import styled from "@emotion/styled";
import axios from "axios";
import { useState } from "react";

const LikeButton = styled("div")(({ theme, liked }) => ({
  color: liked ? theme.palette.primary.main : "default",
}));

export default function Post({
  post,
  handleOpenDelete,
  handleOpenComments,
  userState,
}) {
  const [liked, setLiked] = useState(
    post.likes.includes(userState.id) ? true : false
  );
  const [likes, setLikes] = useState(post.likes.length);

  async function handleLike() {
    try {
      if (!liked) {
        const result = await axios.put(
          `http://localhost:3000/likes/post-add/${post._id}`,
          { id: userState.id }
        );
        setLiked(true);
        setLikes(likes + 1);
      } else {
        const result = await axios.put(
          `http://localhost:3000/likes/post-remove/${post._id}`,
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
    <div className={styles["wrapper"]}>
      <div className={styles["header"]}>
        <div className={styles["profile-picture-container"]}>
          <img src={post.author.profilePicture} />
        </div>
        <div className={styles["post-info"]}>
          <div className={styles["author"]}>
            <span className={unbounded.className}>
              <b>{post.author.username}</b>
            </span>
          </div>
          <div className={styles["posted-at"]}>
            <span className={firaSans.className}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
        </div>
        {post.author._id === userState.id ? (
          <div className={styles["delete-icon"]}>
            <div>
              <div onClick={(e) => handleOpenDelete(post._id)}>
                <CloseIcon />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className={styles["body"]}>
        <span className={firaSans.className}>{post.body}</span>
      </div>
      <div className={styles["interaction"]}>
        <div className={styles["like"]}>
          <div className={styles["like-icon"]}>
            <LikeButton liked={liked} onClick={handleLike}>
              <ThumbUpIcon />
            </LikeButton>
          </div>
          <div className={styles["like-count"]}>
            <span className={firaSans.className}>{likes > 0 ? likes : ""}</span>
          </div>
        </div>
        <div className={styles["comment"]}>
          <div
            onClick={(e) => {
              handleOpenComments({
                comments: post.comments,
                postId: post._id,
              });
            }}
          >
            <CommentIcon fontSize="small" />
          </div>
        </div>
      </div>
    </div>
  );
}
