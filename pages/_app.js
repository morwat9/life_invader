import "../styles/globals.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CookiesProvider } from "react-cookie";

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
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </ThemeProvider>
  );
}
