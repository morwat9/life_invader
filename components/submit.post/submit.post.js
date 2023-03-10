import styles from "./submit.post.module.scss";
import { TextField, Button, Select, InputLabel, FormControl, MenuItem } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { firaSans } from "../../utils/fonts";

export default function SubmitPost({ userState, setRefreshData }) {
  const [post, setPost] = useState({
    body: "",
    category: ""
  });
  const [categoryError, setCategoryError] = useState(false)
  const [bodyLengthError, setBodyLengthError] = useState(false)

  const categories = [
    { value: 'jobs', label: "Jobs" },
    { value: 'housing', label: "Housing" },
    { value: 'services', label: "Services" },
    { value: 'for sale', label: "For Sale" },
  ]

  async function savePost() {
    if(post.body.length < 6 || post.body.length > 400 || post.category === "") {
      if (post.body.length < 6 || post.body.length > 400){
        setBodyLengthError(true)
      }
      if(post.category === ""){
        setCategoryError(true)
      }
      return
    }


    try {
      const response = await axios.post("http://localhost:3000/posts", {
        author: userState.id,
        body: post.body,
        category: post.category
      });
      setPost({
        body: "",
        category: ""
      });
      setRefreshData(true);
    } catch (error) {
      console.log(error);
    }
  }

  function handleInput(value) {
    setPost({ body: value.body, category: value.category })
    setCategoryError(false)
    setBodyLengthError(false)
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
            value={post.body}
            error={bodyLengthError}
            onChange={(e) => {
              handleInput({
                body: e.target.value,
                category: post.category
              })
            }}
          />
        </div>
      </div>
      <div className={styles["footer"]}>
        <div className={styles["dropdown"]}>
          <TextField
            select
            label="Category"
            sx={{ minWidth: 120 }}
            size="small"
            value={post.category}
            error={categoryError}
            onChange={(e) => handleInput({
              body: post.body,
              category: e.target.value
            })}
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Button variant="contained" size="small" onClick={(e) => savePost()}>
          Post
        </Button>
      </div>
        { bodyLengthError ? <span className={styles["error-text"]}><span className={firaSans.className}> Post must be between 6-400 characters long</span></span>: <></>}
        { categoryError ? <span className={styles["error-text"]}><span className={firaSans.className}>Please select a category</span></span> : <></>}
    </div>
  );
}
