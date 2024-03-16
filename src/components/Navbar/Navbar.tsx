import { FC, useContext } from "react";
import {
  Brand,
  MainWrapper,
  NavCompartment,
  StyledLink,
  TertiarySpan,
} from "./styled";
import { DefaultTheme, ThemeContext } from "styled-components";
import themes from "../../themes/schema.json";
import { Button } from "../buttons";
import { Link } from "react-router-dom";

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
      <NavCompartment>
        <Link to="" style={{ textDecoration: "none" }}>
          <Brand>
            Chessmaster<TertiarySpan>.io</TertiarySpan>
          </Brand>
        </Link>
        <StyledLink to="online">Online</StyledLink>
        <StyledLink to="offline">Offline</StyledLink>
        <StyledLink to="scenarios">Scenarios</StyledLink>
        <StyledLink to="puzzles">Puzzles</StyledLink>
      </NavCompartment>
      <NavCompartment>
        <Button
          $background={theme?.colors.secondary1}
          $textColor={theme?.colors.primary1}
          onClick={toggleTheme}
        >
          Toggle Theme
        </Button>
      </NavCompartment>
    </MainWrapper>
  );
};
export default Navbar;
