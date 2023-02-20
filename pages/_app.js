import "../styles/globals.scss";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CookiesProvider, useCookies } from "react-cookie";
import UserContext from "../context/user/user.context.js";
import { userReducer } from "../context/user/user.reducer";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FCA311",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#14213D",
    },
  },
});

export default function App({ Component, pageProps }) {
  const [cookies] = useCookies(["token"]);
  const [userState, userDispatch] = React.useReducer(userReducer, {
    id: "",
    username: "",
    profilePicture: "",
  });

  axios.interceptors.request.use(
    (config) => {
      const token = cookies.token;
      if (token) {
        config.headers["x-access-token"] = token;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  const userProviderState = {
    userState,
    userDispatch,
  };

  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <UserContext.Provider value={userProviderState}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </CookiesProvider>
    </ThemeProvider>
  );
}
