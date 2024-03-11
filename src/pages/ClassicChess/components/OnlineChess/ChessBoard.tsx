import { FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  makeMove,
  updateGameInstance,
} from "../../../../redux/slices/gameStateSlice";
import { Team, TileColor } from "../../../../types/enums";
import {
  AllGamesStates,
  Position,
  StatesOfPieces,
} from "../../../../types/gameTypes";
import { ThemeContext } from "styled-components";
import ChessPiece, { ChessPieceSmall } from "../ChessPiece";
import { RootState } from "../../../../redux/store";
import { socket } from "../../../../socket";
import {
  MainChessboardWrapper,
  CapturedDivWrapper,
  CapturedPiecesWrapper,
  CapturedPiecesWrapperOverlay,
  PlayerName,
  TilesWrapper,
  Tile,
} from "../chessBoardStyles";

const ChessBoard: FC<{
  playerTeam: Team;
  setPlayerTeam: React.Dispatch<React.SetStateAction<Team>>;
}> = ({ playerTeam, setPlayerTeam }) => {
  const [gameId, setGameId] = useState<string>();
  const [deadPiecesState, setDeadPiecesState] = useState<StatesOfPieces>();
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);
  const theme = useContext(ThemeContext);

  const dispatch = useDispatch();
  useEffect(() => {
    socket.connect();
    socket.on("welcome", ({ message, opponent }) => {
      console.log({ message, opponent });
    });
    socket.on("opponentJoin", ({ message, opponent }) => {
      console.log({ message, opponent });
    });

    socket.on("opponentMove", (props: { allGamesStates: AllGamesStates }) => {
      dispatch(updateGameInstance(props.allGamesStates));
      console.log(props.allGamesStates);
    });

    socket.on("message", ({ message }) => {
      console.log({ message });
    });

    return () => {
      socket.off("welcome");
      socket.off("opponentJoin");
      socket.off("opponentMove");
      socket.off("message");
      setPlayerTeam(undefined);
      dispatch(updateGameInstance({ currentMovesState: [], gamesStates: [] }));
      socket.disconnect();
    };
  }, []);

  const handleTileClick = (
    tile: Position,
    validMoves?: Position[],
    selectedPieceId?: string
  ) => {
    if (validMoves?.find((move) => move.x === tile.x && move.y === tile.y)) {
      //move selected piece
      let currentGame = reduxState.gamesStates.find((x) => x.gameId === gameId);
      const currentGameId = currentGame?.gameId;
      let selectedPiece = currentGame?.statesOfPieces.find(
        (x) => x.id === selectedPieceId
      );
      if (currentGame && selectedPiece && currentGameId && tile)
        dispatch(makeMove({ selectedPiece, currentGameId, tile }));
      //change turns
    }
  };

  useEffect(() => {
    setGameId(reduxState?.gamesStates?.[0]?.gameId);
  }, [reduxState]);

  useEffect(() => {
    const deadPieces = reduxState?.gamesStates
      ?.find((x) => x.gameId === gameId)
      ?.statesOfPieces?.filter((x) => !x.alive)
      .sort((a, b) => b.timeCapturedTimestamp - a.timeCapturedTimestamp);
    setDeadPiecesState(deadPieces);
  }, [reduxState]);

  let currentTeam = reduxState?.gamesStates?.find(
    (x) => x.gameId === gameId
  )?.currentTeam;

  return (
    <MainChessboardWrapper>
      <CapturedDivWrapper style={{ marginTop: 0 }}>
        <CapturedPiecesWrapper
          style={{
            opacity: currentTeam === Team.Black ? 1 : 0.3,
          }}
        >
          <CapturedPiecesWrapperOverlay>
            <PlayerName
              style={{
                color: "black",
              }}
            >
              Player 1
            </PlayerName>
            {deadPiecesState
              ?.filter((piece) => piece.team === Team.White)
              .map((piece, index) => {
                return (
                  <ChessPieceSmall
                    key={index}
                    position={piece.position}
                    id={piece.id}
                    team={piece.team}
                    type={piece.type}
                    gameId={gameId}
                  ></ChessPieceSmall>
                );
              })}
          </CapturedPiecesWrapperOverlay>
        </CapturedPiecesWrapper>
      </CapturedDivWrapper>
      <TilesWrapper>
        {reduxState.gamesStates
          ?.find((x) => x.gameId === gameId)
          ?.availableTiles.map((tile, index) => {
            let pieces = reduxState.gamesStates.find(
              (x) => x.gameId === gameId
            )?.statesOfPieces;

            let piece = pieces?.find(
              (x) =>
                JSON.stringify(x.position) === JSON.stringify(tile.position) &&
                x.alive === true
            );
            let currentMoves = reduxState.currentMovesState.find(
              (x) => x.gameId === gameId
            );
            let validMoves = currentMoves?.validMoves;
            let attackPath = reduxState.gamesStates.find(
              (x) => x.gameId === gameId
            )?.checkStatus.attackPath;

            let checkingPieces = reduxState.gamesStates.find(
              (x) => x.gameId === gameId
            )?.checkStatus.checkingPieces;
            let selectedPieceId = currentMoves?.selectedPieceId;
            let selectedPiecePos = pieces?.find(
              (x) => x.id === selectedPieceId
            )?.position;
            let selectedX = selectedPiecePos?.x;
            let selectedY = selectedPiecePos?.y;

            return (
              <Tile
                key={index}
                onMouseDown={() => {
                  handleTileClick(tile.position, validMoves, selectedPieceId);
                }}
                style={{
                  boxShadow: validMoves?.find(
                    (x: Position) =>
                      x.x === tile.position.x && x.y === tile.position.y
                  )
                    ? "inset 0 0 30px #eeff00"
                    : tile.position.x === selectedX &&
                      tile.position.y === selectedY
                    ? `inset 0 0 30px ${theme.colors.tertiary2}`
                    : attackPath?.find(
                        (path) =>
                          path.x === tile.position.x &&
                          path.y === tile.position.y
                      )
                    ? "inset 0 0 30px #ff0000"
                    : checkingPieces?.find(
                        (piece) =>
                          piece.position.x === tile.position.x &&
                          piece.position.y === tile.position.y
                      )
                    ? "inset 0 0 30px #ffd900"
                    : "",
                  background:
                    tile.color === TileColor.Light
                      ? "#FFFFFF" + "55"
                      : "transparent",
                }}
                className={`x-${tile.position.x} y-${tile.position.y}`}
              >
                {piece && piece.alive && (
                  <ChessPiece
                    key={index}
                    position={piece.position}
                    id={piece.id}
                    team={piece.team}
                    type={piece.type}
                    gameId={gameId}
                    playerTeam={playerTeam}
                    online={true}
                  ></ChessPiece>
                )}
                {/* <p
                  style={{
                    position: "absolute",
                    left: "5px",
                    bottom: "5px",
                    margin: 0,
                    opacity: 0.7,
                    color: "#000000",
                    zIndex: -1,
                  }}
                >
                  {tile.chessNotationPosition}
                </p> */}
              </Tile>
            );
          })}
      </TilesWrapper>
      <CapturedDivWrapper style={{ marginBottom: 0 }}>
        <CapturedPiecesWrapper
          style={{
            opacity: currentTeam === Team.White ? 1 : 0.3,
          }}
        >
          <CapturedPiecesWrapperOverlay>
            <PlayerName
              style={{
                color: "black",
              }}
            >
              Player 2
            </PlayerName>
            {deadPiecesState
              ?.filter((piece) => piece.team === Team.Black)
              .map((piece, index) => {
                return (
                  <ChessPieceSmall
                    key={index}
                    position={piece.position}
                    id={piece.id}
                    team={piece.team}
                    type={piece.type}
                    gameId={gameId}
                  ></ChessPieceSmall>
                );
              })}
          </CapturedPiecesWrapperOverlay>
        </CapturedPiecesWrapper>
      </CapturedDivWrapper>
    </MainChessboardWrapper>
  );
};

export default ChessBoard;
