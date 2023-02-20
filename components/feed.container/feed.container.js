import Post from "../post/post";
import axios from "axios";
import { Modal, Button, TextField } from "@mui/material";
import styles from "./feed.container.module.scss";
import { useState, useEffect } from "react";
import { firaSans, shareTechMono, unbounded } from "../../utils/fonts";
import { useUserContext } from "../../context/user/user.context";
import CommentsContainer from "../comments.container/comments.container.js";

export default function FeedContainer({ data, setRefreshData }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [openComments, setOpenComments] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const { userState } = useUserContext();

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setDeleteId("");
    setOpenDelete(false);
  };

  const handleOpenComments = (source) => {
    setAllComments(source.comments);
    setPostId(source.postId);
    setOpenComments(true);
  };

  const handleCloseComments = () => {
    setAllComments([]);
    setPostId("");
    setOpenComments(false);
    setCommentBody("");
    setRefreshData();
  };

  async function deletePost() {
    try {
      const result = await axios.delete(
        `http://localhost:3000/posts/${deleteId}`
      );
      handleCloseDelete();
      setRefreshData();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {data.map((post) => (
        <Post
          post={post}
          key={post._id}
          handleOpenDelete={handleOpenDelete}
          handleOpenComments={handleOpenComments}
          userState={userState}
        />
      ))}
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        disableAutoFocus={true}
      >
        <div className={styles["modal-wrapper"]}>
          <div className={styles["modal-body"]}>
            <p className={firaSans.className}>
              Are you sure you want to delete this post?
            </p>
          </div>
          <div className={styles["modal-footer"]}>
            <Button variant="contained" color="error" onClick={deletePost}>
              Delete
            </Button>
            <Button
              variant="contained"
              color="grey"
              onClick={handleCloseDelete}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <CommentsContainer
        openComments={openComments}
        handleCloseComments={handleCloseComments}
        allComments={allComments}
        setAllComments={setAllComments}
        userState={userState}
        commentBody={commentBody}
        setCommentBody={setCommentBody}
        postId={postId}
      />
    </>
  );
}
