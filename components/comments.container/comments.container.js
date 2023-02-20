import axios from "axios";
import styles from "./comments.container.module.scss";
import { useState, useEffect } from "react";
import { firaSans } from "../../utils/fonts";
import { Modal, Button, TextField } from "@mui/material";
import Comment from "../comment/comment.js";

export default function CommentsContainer({
  openComments,
  handleCloseComments,
  allComments,
  setAllComments,
  userState,
  commentBody,
  setCommentBody,
  postId,
}) {
  async function refresh() {
    try {
      const comments = await axios.get(
        `http://localhost:3000/comments/get-comments/${postId}`
      );
      setAllComments(comments.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function saveComment() {
    try {
      const commentResponse = await axios.post(
        `http://localhost:3000/comments/add-comment/${postId}`,
        { author: userState.id, source: postId, body: commentBody }
      );
      setCommentBody("");
      refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      open={openComments}
      onClose={handleCloseComments}
      disableAutoFocus={true}
    >
      <div className={styles["comments-container"]}>
        <div className={styles["add-comment-button"]}>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => saveComment()}
          >
            Add Comment
          </Button>
        </div>
        <div className={styles["add-comment"]}>
          <div className={styles["profile-picture-container"]}>
            <img src={userState.profilePicture} />
          </div>
          <TextField
            multiline
            fullWidth={true}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
        </div>
        <div className={styles["all-comments"]}>
          {
            // allComments.length > 0 ? allComments.map((comment) => (
            //     <div className={styles['comment-wrapper']} key={comment._id}>
            //         <div className={styles['profile-picture-container']}>
            //             <img src={comment.author.profilePicture} />
            //         </div>
            //         <div className={styles['comment-body']}>
            //             <div className={styles['comment-content']}>
            //                 <span className={firaSans.className}>{comment.body}</span>
            //             </div>
            //             <div className={styles['comment-interaction']}>
            //                 <span className={firaSans.className}>Like</span>
            //             </div>
            //         </div>
            //     </div>
            allComments.length > 0 ? (
              allComments.map((comment) => (
                <Comment
                  comment={comment}
                  userState={userState}
                  key={comment._id}
                />
              ))
            ) : (
              <div className={styles["no-comments-yet"]}>
                <span className={firaSans.className}>No comments yet!</span>
              </div>
            )
          }
        </div>
      </div>
    </Modal>
  );
}
