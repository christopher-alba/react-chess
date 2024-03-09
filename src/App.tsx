import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import themes from "./themes/schema.json";
import { GlobalStyles } from "./themes/globalStyles";
import ClassicChess from "./pages/ClassicChess/ClassicChess";
import Navbar from "./components/Navbar/Navbar";
import "./socket";
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
      <ClassicChess />
    </ThemeProvider>
  );
}

export default App;
