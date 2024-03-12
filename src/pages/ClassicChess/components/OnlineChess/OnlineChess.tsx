import { FC, useEffect, useState } from "react";
import MoveHistory from "../MoveHistory/MoveHistory";
import ChessBoard from "./ChessBoard";
import Messages from "./Messages/Messages";
import PlayersAndSpectators from "./PlayersAndSpectators/PlayersAndSpectators";
import {
  MainWrapper,
  SideInfoWrapper,
  GameControls,
  StyledContainer,
} from "./styled";
import { Team } from "../../../../types/enums";
import Promotion from "../Promotion/Promotion";
import { useLocation } from "react-router-dom";
import { OnlineReturnState, Player } from "../../../../types/gameTypes";
import { updateGameInstance } from "../../../../redux/slices/gameStateSlice";
import { useDispatch } from "react-redux";
import { socket } from "../../../../socket";

const OnlineChess: FC = () => {
  const [playerTeam, setPlayerTeam] = useState<Team>();
  const [spectators, setSpectators] = useState<Player[]>([]);
  const location = useLocation();
  const state = location.state as OnlineReturnState;
  const dispatch = useDispatch();
  useEffect(() => {
    setPlayerTeam(state.player?.color);
    dispatch(updateGameInstance(state.game?.allGamesStates));
    console.log(state.game.spectators);
    if (spectators?.length === 0 || !spectators) {
      console.log("Spectators were null");
      setSpectators(state.game.spectators ?? []);
    }
    socket.connect();
    socket.on("spectatorJoin", ({ spectator }) => {
      console.log(spectator);
      console.log("spectators:", state.game.spectators);
      console.log(spectators);

      if (spectator) {
        setSpectators((prev) => [...prev, spectator]);
        console.log(spectators);
      }
    });

    return () => {
      console.log("UNMOUNTING");
    };
  }, []);
  return (
    <>
      <Promotion playerTeam={playerTeam} online={true} />
      <MainWrapper>
        <PlayersAndSpectators
          gameID={state.game.allGamesStates.gamesStates[0].gameId}
          password={state.game.password}
        />
        <div style={{ width: "100%" }}>
          <Messages />
          <StyledContainer>
            <ChessBoard
              playerTeam={playerTeam ?? Team.None}
              setPlayerTeam={setPlayerTeam}
              game={state.game}
              you={state.player}
            />
            <SideInfoWrapper>
              <GameControls>TIMER</GameControls>
              <MoveHistory />
            </SideInfoWrapper>
            <SideInfoWrapper>
              {spectators?.map((x) => JSON.stringify(x))}
            </SideInfoWrapper>
          </StyledContainer>
        </div>
      </MainWrapper>
    </>
  );
};

export default OnlineChess;
