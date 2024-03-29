import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import themes from "./themes/schema.json";
import { GlobalStyles } from "./themes/globalStyles";
import ClassicChess from "./pages/ClassicChess/ClassicChess";
import Navbar from "./components/Navbar/Navbar";
import "./socket";
import { Route, Routes } from "react-router-dom";
import OnlineLobbies from "./pages/OnlineLobbies/OnlineLobbies";
import MySaves from "./pages/MySaves/MySaves";
import Notifications from "./components/Notifications/Notifications";
import Home from "./pages/Home/Home";
function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme")?.length ?? -1 > 0
      ? JSON.parse(localStorage.getItem("theme") as string)
      : themes.light
  );

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", JSON.stringify(themes.light));
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Navbar setTheme={setTheme} />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="offline" element={<ClassicChess onlineMode={false} />} />
        <Route path="online" element={<OnlineLobbies />} />
        <Route
          path="online/classicChess"
          element={<ClassicChess onlineMode={true} />}
        />
        <Route path="mySaves" element={<MySaves />} />
      </Routes>
      <Notifications />
    </ThemeProvider>
  );
}

export default App;
