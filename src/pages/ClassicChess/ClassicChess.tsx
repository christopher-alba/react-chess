import { FC } from "react";
import { Container } from "../../components/container";
import ChessBoard from "../../components/ChessBoard";
import PlayersAndSpectators from "./components/PlayersAndSpectators/PlayersAndSpectators";
import { MainWrapper } from "./styled";

const ClassicChess: FC = () => {
  return (
    <MainWrapper>
      <PlayersAndSpectators />
      <div style={{width: "100%"}}>
        <Container>
          <ChessBoard />
        </Container>
      </div>
    </MainWrapper>
  );
};

export default ClassicChess;
