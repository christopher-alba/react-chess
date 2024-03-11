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
import { OnlineReturnState } from "../../../../types/gameTypes";
import { updateGameInstance } from "../../../../redux/slices/gameStateSlice";
import { useDispatch } from "react-redux";

const OnlineChess: FC = () => {
  const [playerTeam, setPlayerTeam] = useState<Team>();
  const location = useLocation();
  const state = location.state as OnlineReturnState;
  const dispatch = useDispatch();
  useEffect(() => {
    setPlayerTeam(state.color);
    dispatch(updateGameInstance(state.state));
  }, []);
  return (
    <>
      <Promotion playerTeam={playerTeam} online={true} />
      <MainWrapper>
        <PlayersAndSpectators
          gameID={state.state?.gamesStates?.[0]?.gameId}
          password={state.password}
        />
        <div style={{ width: "100%" }}>
          <Messages />
          <StyledContainer>
            <ChessBoard playerTeam={playerTeam} setPlayerTeam={setPlayerTeam} />
            <SideInfoWrapper>
              <GameControls>TIMER</GameControls>
              <MoveHistory />
            </SideInfoWrapper>
          </StyledContainer>
        </div>
      </MainWrapper>
    </>
  );
};

export default OnlineChess;
