import { FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGameInstance, makeMove } from "../redux/slices/gameStateSlice";
import { v4 as uuidv4 } from "uuid";
import {
  CheckType,
  GameState,
  Mode,
  Team,
  TileColor,
  Type,
} from "../types/enums";
import { Position, StatesOfPieces, Tiles } from "../types/gameTypes";
import styled, { ThemeContext } from "styled-components";
import ChessPiece, { ChessPieceSmall } from "./ChessPiece";
import { RootState } from "../redux/store";

const ChessBoard: FC = () => {
  const [allTiles, setAllTiles] = useState<Position[]>();
  const [gameId, setGameId] = useState<string>();
  const [deadPiecesState, setDeadPiecesState] = useState<StatesOfPieces>();
  const dispatch = useDispatch();
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);
  const theme = useContext(ThemeContext);
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
    //   position: { x: 3, y: 1 },
    //   alive: true,
    //   team: Team.White,
    //   id: uuidv4(),
    //   type: Type.Rook,
    // });
    // pieces.push({
    //   position: { x: 1, y: 0},
    //   alive: true,
    //   team: Team.White,
    //   id: uuidv4(),
    //   type: Type.Bishop,
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
    });
    pieces.push({
      position: { x: 1, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Knight,
    });
    pieces.push({
      position: { x: 2, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Bishop,
    });
    pieces.push({
      position: { x: 4, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.King,
    });
    pieces.push({
      position: { x: 3, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Queen,
    });
    pieces.push({
      position: { x: 5, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Bishop,
    });
    pieces.push({
      position: { x: 6, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Knight,
    });
    pieces.push({
      position: { x: 7, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Rook,
    });
    for (let x = 0; x < 8; x++) {
      pieces.push({
        position: { x: x, y: 1 },
        alive: true,
        team: Team.Black,
        id: uuidv4(),
        type: Type.Pawn,
      });
    }

    //white pieces
    pieces.push({
      position: { x: 0, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Rook,
    });
    pieces.push({
      position: { x: 1, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Knight,
    });
    pieces.push({
      position: { x: 2, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Bishop,
    });
    pieces.push({
      position: { x: 4, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.King,
    });
    pieces.push({
      position: { x: 3, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Queen,
    });
    pieces.push({
      position: { x: 5, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Bishop,
    });
    pieces.push({
      position: { x: 6, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Knight,
    });
    pieces.push({
      position: { x: 7, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Rook,
    });
    for (let x = 0; x < 8; x++) {
      pieces.push({
        position: { x: x, y: 6 },
        alive: true,
        team: Team.White,
        id: uuidv4(),
        type: Type.Pawn,
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
    const deadPieces = reduxState?.gamesStates
      .find((x) => x.gameId === gameId)
      ?.statesOfPieces?.filter((x) => !x.alive)
      .sort((a, b) => b.timeCapturedTimestamp - a.timeCapturedTimestamp);
    setDeadPiecesState(deadPieces);
  }, [reduxState]);

  let currentTeam = reduxState.gamesStates.find(
    (x) => x.gameId === gameId
  )?.currentTeam;

  return (
    <MainChessboardWrapper>
      <CapturedDivWrapper>
        <CapturedPiecesWrapper>
          <CapturedPiecesWrapperOverlay>
            <PlayerName
              style={{
                color:
                  currentTeam === Team.Black
                    ? theme.colors.tertiary1
                    : "black",
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
                    ? `inset 0 0 30px ${theme.colors.tertiary1}`
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
                      ? "#FFFFFF" + "EE"
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
                  ></ChessPiece>
                )}
              </Tile>
            );
          } else {
            return <Tile key={index}></Tile>;
          }
        })}
      </TilesWrapper>
      <CapturedDivWrapper>
        <CapturedPiecesWrapper>
          <CapturedPiecesWrapperOverlay>
            <PlayerName
              style={{
                color:
                  currentTeam === Team.White
                    ? theme.colors.tertiary1
                    : "black",
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
`;

const TilesWrapper = styled("div")`
  box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  border: 2px solid white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #EAEAEA;
  backdrop-filter: blur(8px);
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
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
  background: #EAEAEA;

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
  aspect-ratio: 1/1;
`;

export default ChessBoard;
