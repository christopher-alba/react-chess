import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { promotePawn } from "../../../../redux/slices/gameStateSlice";
import { Team, Type } from "../../../../types/enums";
import {
  BishopIcon,
  KnightIcon,
  ModalBackdrop,
  ModalBody,
  PromoteButton,
  QueenIcon,
  RookIcon,
} from "./styled";
import Draggable from "react-draggable";

const Promotion: FC<{ playerTeam?: Team; online: boolean }> = ({
  playerTeam,
  online,
}) => {
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);
  const dispatch = useDispatch();
  const handlePromotionClick = (type: Type) => {
    let currentGame = reduxState.gamesStates[0];
    const currentGameId = currentGame?.gameId;
    let selectedPiece = currentGame?.promotionPiece;

    if (currentGame && selectedPiece && currentGameId) {
      dispatch(
        promotePawn({
          currentGameId,
          pawnToPromote: selectedPiece,
          targetPieceType: type,
        })
      );
    }
  };
  let shouldDisplay = true;
  if (online) {
    shouldDisplay = reduxState.gamesStates?.[0]?.currentTeam
      .toLowerCase()
      .includes(playerTeam?.toLowerCase());
  }

  return (
    (reduxState.gamesStates?.[0]?.currentTeam === Team.WhitePromotion ||
      reduxState.gamesStates?.[0]?.currentTeam === Team.BlackPromotion) &&
    shouldDisplay && (
      <ModalBackdrop>
        <Draggable bounds="parent">
          <ModalBody>
            <PromoteButton
              onClick={() => {
                handlePromotionClick(Type.Queen);
              }}
            >
              <QueenIcon team={reduxState.gamesStates[0].currentTeam} />
            </PromoteButton>
            <PromoteButton
              onClick={() => {
                handlePromotionClick(Type.Bishop);
              }}
            >
              <BishopIcon team={reduxState.gamesStates[0].currentTeam} />
            </PromoteButton>
            <PromoteButton
              onClick={() => {
                handlePromotionClick(Type.Rook);
              }}
            >
              <RookIcon team={reduxState.gamesStates[0].currentTeam} />
            </PromoteButton>
            <PromoteButton
              onClick={() => {
                handlePromotionClick(Type.Knight);
              }}
            >
              <KnightIcon team={reduxState.gamesStates[0].currentTeam} />
            </PromoteButton>
          </ModalBody>
        </Draggable>
      </ModalBackdrop>
    )
  );
};

export default Promotion;
