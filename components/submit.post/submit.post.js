import styles from "./submit.post.module.scss";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function SubmitPost({ userState, setRefreshData }) {
  const [body, setBody] = useState("");

  async function savePost() {
    try {
      const response = await axios.post("http://localhost:3000/posts", {
        author: userState.id,
        body: body,
      });
      setBody("");
      setRefreshData(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["body"]}>
        <div className={styles["profile-picture-container"]}>
          <img src={userState.profilePicture} />
        </div>
        <div className={styles["text-container"]}>
          <TextField
            label="What's on your mind?"
            multiline
            rows={2}
            fullWidth={true}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>
      <div className={styles["footer"]}>
        <Button variant="contained" size="small" onClick={(e) => savePost()}>
          Post
        </Button>
      </div>
    </div>
  );
}
