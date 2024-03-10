import { FC, useState } from "react";
import { Container } from "../../components/container";
import ChessBoard from "./components/ChessBoard";
import PlayersAndSpectators from "./components/PlayersAndSpectators/PlayersAndSpectators";
import { GameControls, MainWrapper, SideInfoWrapper } from "./styled";
import MoveHistory from "./components/MoveHistory/MoveHistory";
import Promotion from "./components/Promotion/Promotion";
import { Team } from "../../types/enums";

const ClassicChess: FC = () => {
  const [playerTeam, setPlayerTeam] = useState<Team>();
  return (
    <>
      <Promotion playerTeam={playerTeam} />
      <MainWrapper>
        <PlayersAndSpectators />
        <div style={{ width: "100%" }}>
          <Container style={{ display: "flex", position: "relative" }}>
            <ChessBoard playerTeam={playerTeam} setPlayerTeam={setPlayerTeam} />
            <SideInfoWrapper>
              <GameControls>TIMER</GameControls>
              <MoveHistory />
            </SideInfoWrapper>
          </Container>
        </div>
      </MainWrapper>
    </>
  );
};

export default ClassicChess;
