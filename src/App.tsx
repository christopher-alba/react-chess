import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import themes from "./themes/schema.json";
import { GlobalStyles } from "./themes/globalStyles";
import ClassicChess from "./pages/ClassicChess/ClassicChess";
import Navbar from "./components/Navbar/Navbar";
import "./socket";
import { Route, Routes } from "react-router-dom";
import OnlineLobbies from "./pages/OnlineLobbies/OnlineLobbies";
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
        <Route path="offline" element={<ClassicChess onlineMode={false} />} />
        <Route path="online" element={<OnlineLobbies />} />
        <Route
          path="online/classicChess"
          element={<ClassicChess onlineMode={true} />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
