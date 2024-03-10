import { FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  makeMove,
  updateGameInstance,
} from "../../../redux/slices/gameStateSlice";
import { Team, TileColor } from "../../../types/enums";
import {
  AllGamesStates,
  OnlineReturnState,
  Position,
  StatesOfPieces,
} from "../../../types/gameTypes";
import styled, { ThemeContext } from "styled-components";
import ChessPiece, { ChessPieceSmall } from "./ChessPiece";
import { RootState } from "../../../redux/store";
import { socket } from "../../../socket";
import { useLocation, useNavigate } from "react-router-dom";

const ChessBoard: FC<{
  playerTeam: Team;
  setPlayerTeam: React.Dispatch<React.SetStateAction<Team>>;
}> = ({ playerTeam, setPlayerTeam }) => {
  const [gameId, setGameId] = useState<string>();
  const location = useLocation();
  const navigate = useNavigate();
  const [deadPiecesState, setDeadPiecesState] = useState<StatesOfPieces>();
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);
  const theme = useContext(ThemeContext);

  const dispatch = useDispatch();
  useEffect(() => {
    const state = location.state as OnlineReturnState;
    setPlayerTeam(state.color);
    dispatch(updateGameInstance(state.state));
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
      <h1>gameID: {gameId}</h1>
      <p>Your Team: {playerTeam}</p>
      <button
        onClick={() => {
          setPlayerTeam(undefined);
          dispatch(
            updateGameInstance({ currentMovesState: [], gamesStates: [] })
          );
          socket.disconnect();
          navigate("/online");
        }}
      >
        Disconnect
      </button>
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
          .find((x) => x.gameId === gameId)
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
                <p
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
                </p>
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

const Tile = styled("div")`
  height: 1/8;
  width: 1/8;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
`;

const TilesWrapper = styled("div")`
  box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  border: 2px solid white;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.tertiary1};
  backdrop-filter: blur(8px);
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  aspect-ratio: 1/1;
`;

const CapturedPiecesWrapper = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  border: 2px solid white;
  box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  background: ${({ theme }) => theme.colors.tertiary1};
`;

const CapturedPiecesWrapperOverlay = styled("div")`
  backdrop-filter: blur(18px);
  height: 100%;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding-right: 20px;
`;

const CapturedDivWrapper = styled("div")`
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  height: 50px;
  align-items: center;
`;

const PlayerName = styled("h3")`
  margin: 0;
  width: 200px;
  transition: 500ms;
  padding-left: 30px;
  font-weight: 200;
  letter-spacing: 3px;
`;

const MainChessboardWrapper = styled("div")`
  max-width: 550px;
  max-height: 550px;
  aspect-ratio: 1/1;
`;

export default ChessBoard;
