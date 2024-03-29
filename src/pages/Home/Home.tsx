import { FC, useContext } from "react";
import { ContentWrapper, HeroText, MainWrapper, StyledVideo } from "./styled";
import { ButtonLink } from "../../components/buttons";
import { ThemeContext } from "styled-components";
import { ButtonGroup } from "../../components/buttonGroups";

const Home: FC = () => {
  const theme = useContext(ThemeContext);
  return (
    <MainWrapper>
      <StyledVideo
        src="./assets/videos/chessmaster-homepage.mp4"
        autoPlay
        muted
        id="homepage-video"
      />
      <ContentWrapper>
        <div>
          <HeroText>Master Chess. Welcome to Chessmaster.io</HeroText>
          <p>Made by Christopher Sy Alba.</p>
          <div style={{ display: "flex" }}>
            <ButtonLink
              to="/offline"
              $background={theme?.colors.tertiary1}
              $textColor={theme?.colors.primary1}
              $width="100px"
              style={{marginRight: "20px"}}
            >
              Play Offline
            </ButtonLink>
            <ButtonGroup style={{ marginTop: "0px" }}>
              <ButtonLink
                to="/online"
                $background={theme?.colors.primary1}
                $textColor={theme?.colors.secondary1}
                $width="100px"
              >
                Spectate Online
              </ButtonLink>
              <ButtonLink
                to="/online"
                $background={theme?.colors.secondary1}
                $textColor={theme?.colors.primary1}
                $width="100px"
              >
                Play Online
              </ButtonLink>
            </ButtonGroup>
          </div>
        </div>
      </ContentWrapper>
    </MainWrapper>
  );
};

export default Home;
