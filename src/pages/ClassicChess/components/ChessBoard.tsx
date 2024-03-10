import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGameInstance,
  makeMove,
  updateGameId,
  updateGameInstance,
} from "../../../redux/slices/gameStateSlice";
import { v4 as uuidv4 } from "uuid";
import {
  CheckType,
  GameState,
  Mode,
  Team,
  TileColor,
  Type,
} from "../../../types/enums";
import {
  AllGamesStates,
  Position,
  StatesOfPieces,
  Tiles,
} from "../../../types/gameTypes";
import styled, { ThemeContext } from "styled-components";
import ChessPiece, { ChessPieceSmall } from "./ChessPiece";
import { RootState } from "../../../redux/store";
import { mapCoordinatesToChessNotation } from "../../../helpers/general";
import { socket } from "../../../socket";

const ChessBoard: FC<{
  playerTeam: Team;
  setPlayerTeam: React.Dispatch<React.SetStateAction<Team>>;
}> = ({ playerTeam, setPlayerTeam }) => {
  const [allTiles, setAllTiles] = useState<Position[]>();
  const [gameId, setGameId] = useState<string>();
  const [inputId, setInputId] = useState<string>();

  const [deadPiecesState, setDeadPiecesState] = useState<StatesOfPieces>();
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);
  const theme = useContext(ThemeContext);

  const dispatch = useDispatch();
  useEffect(() => {
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

  const initialize2PlayerBoardTiles = (): Tiles => {
    let tilesArray: Tiles = [];
    for (let y = 0; y < 8; y++) {
      let color = y % 2 === 0 ? TileColor.Light : TileColor.Dark;
      for (let x = 0; x < 8; x++) {
        tilesArray.push({
          position: {
            x: x,
            y: y,
          },
          chessNotationPosition: mapCoordinatesToChessNotation(x, y),
          isWall: false,
          color: color,
        });
        color = color === TileColor.Light ? TileColor.Dark : TileColor.Light;
      }
    }
    return tilesArray;
  };
  const initialize2PlayerBoardPieces = (): StatesOfPieces => {
    let pieces: StatesOfPieces = [];
    // pieces.push({
    //   position: { x: 0, y: 6 },
    //   alive: true,
    //   team: Team.Black,
    //   id: uuidv4(),
    //   type: Type.Pawn,
    //   chessNotationPosition: mapCoordinatesToChessNotation(0, 6),
    // });
    // pieces.push({
    //   position: { x: 5, y: 7},
    //   alive: true,
    //   team: Team.White,
    //   id: uuidv4(),
    //   type: Type.King,
    //   chessNotationPosition: mapCoordinatesToChessNotation(5, 7),
    // });
    // pieces.push({
    //   position: { x: 2, y: 0 },
    //   alive: true,
    //   team: Team.Black,
    //   id: uuidv4(),
    //   type: Type.King,
    // });

    // black pieces
    pieces.push({
      position: { x: 0, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Rook,
      chessNotationPosition: mapCoordinatesToChessNotation(0, 0),
    });
    pieces.push({
      position: { x: 1, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Knight,
      chessNotationPosition: mapCoordinatesToChessNotation(1, 0),
    });
    pieces.push({
      position: { x: 2, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Bishop,
      chessNotationPosition: mapCoordinatesToChessNotation(2, 0),
    });
    pieces.push({
      position: { x: 4, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.King,
      chessNotationPosition: mapCoordinatesToChessNotation(4, 0),
    });
    pieces.push({
      position: { x: 3, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Queen,
      chessNotationPosition: mapCoordinatesToChessNotation(3, 0),
    });
    pieces.push({
      position: { x: 5, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Bishop,
      chessNotationPosition: mapCoordinatesToChessNotation(5, 0),
    });
    pieces.push({
      position: { x: 6, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Knight,
      chessNotationPosition: mapCoordinatesToChessNotation(6, 0),
    });
    pieces.push({
      position: { x: 7, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Rook,
      chessNotationPosition: mapCoordinatesToChessNotation(7, 0),
    });
    for (let x = 0; x < 8; x++) {
      pieces.push({
        position: { x: x, y: 1 },
        alive: true,
        team: Team.Black,
        id: uuidv4(),
        type: Type.Pawn,
        chessNotationPosition: mapCoordinatesToChessNotation(x, 1),
      });
    }

    //white pieces
    pieces.push({
      position: { x: 0, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Rook,
      chessNotationPosition: mapCoordinatesToChessNotation(0, 7),
    });
    pieces.push({
      position: { x: 1, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Knight,
      chessNotationPosition: mapCoordinatesToChessNotation(1, 7),
    });
    pieces.push({
      position: { x: 2, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Bishop,
      chessNotationPosition: mapCoordinatesToChessNotation(2, 7),
    });
    pieces.push({
      position: { x: 4, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.King,
      chessNotationPosition: mapCoordinatesToChessNotation(4, 7),
    });
    pieces.push({
      position: { x: 3, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Queen,
      chessNotationPosition: mapCoordinatesToChessNotation(3, 7),
    });
    pieces.push({
      position: { x: 5, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Bishop,
      chessNotationPosition: mapCoordinatesToChessNotation(5, 7),
    });
    pieces.push({
      position: { x: 6, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Knight,
      chessNotationPosition: mapCoordinatesToChessNotation(6, 7),
    });
    pieces.push({
      position: { x: 7, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Rook,
      chessNotationPosition: mapCoordinatesToChessNotation(7, 7),
    });
    for (let x = 0; x < 8; x++) {
      pieces.push({
        position: { x: x, y: 6 },
        alive: true,
        team: Team.White,
        id: uuidv4(),
        type: Type.Pawn,
        chessNotationPosition: mapCoordinatesToChessNotation(x, 6),
      });
    }
    return pieces;
  };

  useEffect(() => {
    let allTiles: Position[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        allTiles.push({
          x: x,
          y: y,
        });
      }
    }

    setAllTiles(allTiles);
    let id = uuidv4();
    setGameId(id);
    dispatch(
      createGameInstance({
        gameId: id,
        mode: Mode.TwoPlayer,
        currentTeam: Team.White,
        moveHistory: [],
        teamStates: [
          {
            teamName: Team.White,
            alive: true,
            winner: false,
            castlingStates: {
              KingMoved: false,
              KingRookMoved: false,
              QueenRookMoved: false,
              KingSide: false,
              QueenSide: false,
            },
            enpassantStates: {
              alliedEnpassantPawns: [],
              enemyEnpassantPawns: [],
            },
          },
          {
            teamName: Team.Black,
            alive: true,
            winner: false,
            castlingStates: {
              KingMoved: false,
              KingRookMoved: false,
              QueenRookMoved: false,
              KingSide: false,
              QueenSide: false,
            },
            enpassantStates: {
              alliedEnpassantPawns: [],
              enemyEnpassantPawns: [],
            },
          },
        ],
        gameState: GameState.Stopped,
        checkStatus: {
          type: CheckType.None,
          teamInCheck: Team.None,
          checkingPieces: undefined,
        },
        availableTiles: initialize2PlayerBoardTiles(),
        statesOfPieces: initialize2PlayerBoardPieces(),
      })
    );
    console.log("testing A");
  }, []);

  useEffect(() => {
    setGameId(reduxState?.gamesStates[0]?.gameId);
  }, [reduxState]);

  useEffect(() => {
    const deadPieces = reduxState?.gamesStates
      .find((x) => x.gameId === gameId)
      ?.statesOfPieces?.filter((x) => !x.alive)
      .sort((a, b) => b.timeCapturedTimestamp - a.timeCapturedTimestamp);
    setDeadPiecesState(deadPieces);
  }, [reduxState]);

  let currentTeam = reduxState.gamesStates.find(
    (x) => x.gameId === gameId
  )?.currentTeam;

  function handleIdChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputId(event.target.value);
  }

  return (
    <MainChessboardWrapper>
      <h1>gameID: {gameId}</h1>
      <p>Your Team: {playerTeam}</p>
      <input type="text" onChange={handleIdChange} />
      <button
        onClick={() => {
          if (!gameId) return;
          socket.connect();
          socket.emit(
            "join",
            { name: "Frank 2", gameID: inputId },
            ({ color }) => {
              setPlayerTeam(color);
              setGameId(inputId);
              dispatch(updateGameId(inputId));
            }
          );
        }}
      >
        Join Game
      </button>
      <button
        onClick={() => {
          if (!gameId) return;
          socket.connect();
          socket.emit(
            "create",
            { name: "Frank", gameID: gameId },
            ({ color }) => {
              setPlayerTeam(color);
            }
          );
        }}
      >
        Create Game
      </button>
      <button
        onClick={() => {
          setPlayerTeam(undefined);
          socket.disconnect();
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
        {allTiles?.map((tile, index) => {
          let pieces = reduxState.gamesStates.find(
            (x) => x.gameId === gameId
          )?.statesOfPieces;
          let tiles = reduxState.gamesStates.find(
            (x) => x.gameId === gameId
          )?.availableTiles;
          let matching = tiles?.find(
            (x) => JSON.stringify(x.position) === JSON.stringify(tile)
          );
          let piece = pieces?.find(
            (x) =>
              JSON.stringify(x.position) === JSON.stringify(tile) &&
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

          if (matching) {
            return (
              <Tile
                key={index}
                onMouseDown={() => {
                  handleTileClick(tile, validMoves, selectedPieceId);
                }}
                style={{
                  boxShadow: validMoves?.find(
                    (x: Position) => x.x === tile.x && x.y === tile.y
                  )
                    ? "inset 0 0 30px #eeff00"
                    : tile.x === selectedX && tile.y === selectedY
                    ? `inset 0 0 30px ${theme.colors.tertiary2}`
                    : attackPath?.find(
                        (path) => path.x === tile.x && path.y === tile.y
                      )
                    ? "inset 0 0 30px #ff0000"
                    : checkingPieces?.find(
                        (piece) =>
                          piece.position.x === tile.x &&
                          piece.position.y === tile.y
                      )
                    ? "inset 0 0 30px #ffd900"
                    : "",
                  background:
                    matching.color === TileColor.Light
                      ? "#FFFFFF" + "55"
                      : "transparent",
                }}
                className={`x-${tile.x} y-${tile.y}`}
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
                  {matching.chessNotationPosition}
                </p>
              </Tile>
            );
          } else {
            return <Tile key={index}></Tile>;
          }
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
