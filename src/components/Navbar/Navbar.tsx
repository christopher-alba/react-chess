import { FC, useContext } from "react";
import { MainWrapper } from "./styled";
import { DefaultTheme, ThemeContext } from "styled-components";
import themes from "../../themes/schema.json";

const Navbar: FC<{ setTheme: (theme: DefaultTheme) => void }> = ({
  setTheme,
}) => {
  const theme = useContext(ThemeContext);
  const toggleTheme = () => {
    if (theme?.name === "light") {
      localStorage.setItem("theme", JSON.stringify(themes.dark));
      setTheme(themes.dark);
    } else {
      localStorage.setItem("theme", JSON.stringify(themes.light));
      setTheme(themes.light);
    }
  };
  return (
    <MainWrapper>
      <h1>Navbar</h1>
      <button onClick={toggleTheme}>Toggle</button>
    </MainWrapper>
  );
};
export default Navbar;
