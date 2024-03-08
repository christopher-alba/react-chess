import { FC } from "react";
import { Container } from "../../components/container";
import ChessBoard from "./components/ChessBoard";
import PlayersAndSpectators from "./components/PlayersAndSpectators/PlayersAndSpectators";
import { GameControls, MainWrapper, SideInfoWrapper } from "./styled";
import MoveHistory from "./components/MoveHistory/MoveHistory";

const ClassicChess: FC = () => {
  return (
    <MainWrapper>
      <PlayersAndSpectators />
      <div style={{ width: "100%" }}>
        <Container style={{ display: "flex", position: "relative" }}>
          <ChessBoard />
          <SideInfoWrapper>
            <GameControls>TIMER</GameControls>
            <MoveHistory />
          </SideInfoWrapper>
        </Container>
      </div>
    </MainWrapper>
  );
};

export default ClassicChess;
