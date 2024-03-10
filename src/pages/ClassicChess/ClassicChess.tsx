import { FC, useState } from "react";
import { Container } from "../../components/container";
import ChessBoard from "./components/ChessBoard";
import PlayersAndSpectators from "./components/PlayersAndSpectators/PlayersAndSpectators";
import { GameControls, MainWrapper, SideInfoWrapper } from "./styled";
import MoveHistory from "./components/MoveHistory/MoveHistory";
import Promotion from "./components/Promotion/Promotion";
import { Team } from "../../types/enums";
import OfflineChessBoard from "./components/OfflineChessBoard";

const ClassicChess: FC<{ onlineMode: boolean }> = ({ onlineMode }) => {
  const [playerTeam, setPlayerTeam] = useState<Team>();
  return (
    <>
      <Promotion playerTeam={playerTeam} online={onlineMode} />

      <MainWrapper>
        <PlayersAndSpectators />
        <div style={{ width: "100%" }}>
          <p>online mode: {onlineMode.toString()}</p>
          <Container style={{ display: "flex", position: "relative" }}>
            {onlineMode ? (
              <ChessBoard
                playerTeam={playerTeam}
                setPlayerTeam={setPlayerTeam}
              />
            ) : (
              <OfflineChessBoard />
            )}
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
