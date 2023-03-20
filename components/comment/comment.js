import { firaSans, shareTechMono } from "../../utils/fonts";
import { useState } from "react";
import axios from "axios";
import styles from "./comment.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { Modal, Button } from "@mui/material";


export default function Comment({ comment, userState, refresh }) {
  const [liked, setLiked] = useState(
    comment.likes.includes(userState.id) ? true : false
  );
  const [likes, setLikes] = useState(comment.likes.length);
  const [openModal, setOpenModal] = useState(false)
  const [deleteId, setDeleteId] = useState("")

  async function handleLike() {
    try {
      if (!liked) {
        const result = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/likes/comment-add/${comment._id}`,
          { id: userState.id }
        );
        setLiked(true);
        setLikes(likes + 1);
      } else {
        const result = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/likes/comment-remove/${comment._id}`,
          { id: userState.id }
        );
        setLiked(false);
        setLikes(likes - 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment() {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comments/${deleteId}`)
      refresh()
    } catch (error) {
      console.log(error)
    }
  }

  function handleOpenModal() {
    setDeleteId(comment._id)
    setOpenModal(true)
  }

  function handleCloseModal() {
    setDeleteId("")
    setOpenModal(false)
  }

  return (
    <div className={styles["comment-wrapper"]} key={comment._id}>
      <div className={styles["profile-picture-container"]}>
        <img src={comment.author.profilePicture} />
      </div>
      <div className={styles["comment-body"]}>
        <div className={styles["comment-header"]}>
          <div className={styles["comment-author"]}>
            <span className={shareTechMono.className}>{comment.author.username}</span>
            <span className={firaSans.className} >{comment.author.email}</span>
          </div>
          <div className={styles["delete-icon"]}>
            {userState.id === comment.author._id ? <CloseIcon fontSize="xsmall" onClick={handleOpenModal} /> : <></>}
          </div>
        </div>
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
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <div className={styles["modal-wrapper"]}>
          <div className={styles["modal-body"]}>
            <p className={firaSans.className}>
              Are you sure you want to delete this comment?
            </p>
          </div>
          <div className={styles["modal-footer"]}>
            <Button variant="contained" color="error" onClick={deleteComment}>
              Delete
            </Button>
            <Button
              variant="contained"
              color="grey"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
