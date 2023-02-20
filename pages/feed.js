import Layout from "../components/layout/layout";
import styles from "../styles/feed.module.scss";
import { useEffect, Suspense, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useUserContext } from "../context/user/user.context";
import axios from "axios";
import SubmitPost from "../components/submit.post/submit.post";
import FeedContainer from "../components/feed.container/feed.container";

export default function Feed({ data }) {
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [postData, setPostData] = useState(data);
  const [loading, setLoading] = useState(true);
  const { userState, userDispatch } = useUserContext();
  const router = useRouter();

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
        Looooooooooooooooooooooooooooooooooooooooooooooaaaaaaaaaaaaaaaaaaaading
      </div>
    );
  } else {
    return (
      <Layout>
        <div className={styles["wrapper"]}>
          <SubmitPost userState={userState} setRefreshData={refresh} />
          <div className={styles["feed-container"]}>
            <FeedContainer data={postData} setRefreshData={refresh} />
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
