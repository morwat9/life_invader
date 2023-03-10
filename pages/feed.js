import Layout from "../components/layout/layout";
import styles from "../styles/feed.module.scss";
import { useEffect, Suspense, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useUserContext } from "../context/user/user.context";
import axios from "axios";
import SubmitPost from "../components/submit.post/submit.post";
import FeedContainer from "../components/feed.container/feed.container";
import { Tab, Tabs, CircularProgress, useMediaQuery, Select, MenuItem, InputLabel, FormControl, TextField } from "@mui/material";

export default function Feed({ data }) {
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [postData, setPostData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all')
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  const { userState, userDispatch } = useUserContext();
  const router = useRouter();
  const categories = [
    { value: 'all', label: "All"},
    { value: 'jobs', label: "Jobs" },
    { value: 'housing', label: "Housing" },
    { value: 'services', label: "Services" },
    { value: 'for sale', label: "For Sale" },
  ]

  async function checkUser() {
    try {
      const id = window.localStorage.getItem("id");
      const user = await axios.get(`http://localhost:3000/users/${id}`, {
        "x-access-token": userState.cookie,
      });
      if (!user) {
        throw new Error();
      }
      return user.data;
    } catch (error) {
      return error;
    }
  }

  const filteredFeed = postData.filter((post) => {
    if (selectedCategory === 'all') {
      return true
    } else {
      return post.category === selectedCategory
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined" && userState.id === "") {
      (async () => {
        try {
          if (!window.localStorage.getItem("id") || !document.cookie) {
            throw new Error();
          }
          const result = await checkUser();
          const user = {
            id: result._id,
            username: result.username,
            profilePicture: result.profilePicture,
          };
          userDispatch(user);
          setLoading(false);
        } catch (error) {
          removeCookie("token");
          localStorage.removeItem("id");
          router.push("/");
        }
      })();
    }
    setLoading(false)
  }, [userState]);

  async function refresh() {
    try {
      const result = await axios.get("http://localhost:3000/posts/feed");
      setPostData(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <Layout>
        <div className={styles["wrapper"]}>
          <SubmitPost userState={userState} setRefreshData={refresh} />
          {isSmallScreen ?
            <Tabs
              centered
              value={selectedCategory}
              onChange={(e, newValue) => {
                setSelectedCategory(newValue)
              }}
            >
              <Tab value="all" label="All" />
              <Tab value="jobs" label="Jobs" />
              <Tab value="housing" label="Housing" />
              <Tab value="services" label="Services" />
              <Tab value="for sale" label="For Sale" />
            </Tabs>
            :

            <div className={styles["category-select"]}>
              {/* <FormControl>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                >
                  <MenuItem>All</MenuItem>
                  <MenuItem>Jobs</MenuItem>
                  <MenuItem>Housing</MenuItem>
                  <MenuItem>Services</MenuItem>
                  <MenuItem>For Sale</MenuItem>
                </Select>
              </FormControl> */}
              <TextField 
              select
              label="Filter By"
              sx={{ minWidth: 120}}
              size="small"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
              }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          }
          <div className={styles["feed-container"]}>
            <FeedContainer data={filteredFeed} setRefreshData={refresh} />
          </div>
        </div>
      </Layout>
    );
  }
}

export async function getServerSideProps() {
  const posts = await axios.get("http://localhost:3000/posts/feed");
  const data = posts.data;
  return { props: { data } };
}
