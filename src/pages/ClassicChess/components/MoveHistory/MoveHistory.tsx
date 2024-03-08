import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { InnerWrapper, MainWrapper, MoveWrapper, Title } from "./styled";
import { MoveDetailsForHistory } from "../../../../types/gameTypes";
import { MoveConsequence } from "../../../../types/enums";

const MoveHistory: FC = () => {
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);
  let moveHistory: MoveDetailsForHistory[] = JSON.parse(
    JSON.stringify(reduxState.gamesStates?.[0]?.moveHistory ?? [])
  );
  moveHistory.reverse();
  return (
    <MainWrapper>
      <Title>Move History</Title>
      <InnerWrapper>
        {moveHistory?.map((move, index) => (
          <MoveWrapper>
            <p>
              Move #{moveHistory.length - index}.{" "}
              <strong>
                {" "}
                {move.team}'s move: {move.originPiece.type} from{" "}
                {move.chessNotationOriginPosition} to{" "}
                {move.chessNotationPosition}.{" "}
              </strong>{" "}
              {move.moveConsequence !== MoveConsequence.Default
                ? move.moveConsequence
                : ""}{" "}
              {move.capturedPiece
                ? `: ${move.capturedPiece.type} ${move.capturedPiece.team} `
                : ""}
            </p>
          </MoveWrapper>
        ))}
      </InnerWrapper>
    </MainWrapper>
  );
};

export default MoveHistory;
