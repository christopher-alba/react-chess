import { FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGameInstance,
  deleteGameInstance,
  makeMove,
  updateGameInstance,
} from "../../../../redux/slices/gameStateSlice";
import { v4 as uuidv4 } from "uuid";
import {
  CheckType,
  GameState,
  Mode,
  Team,
  TileColor,
  Type,
} from "../../../../types/enums";
import {
  AllGamesStates,
  Position,
  StatesOfPieces,
  Tiles,
} from "../../../../types/gameTypes";
import { ThemeContext } from "styled-components";
import { ChessPieceSmall } from "../ChessPiece";

import { mapCoordinatesToChessNotation } from "../../../../helpers/general";
import {
  MainChessboardWrapper,
  CapturedDivWrapper,
  CapturedPiecesWrapper,
  CapturedPiecesWrapperOverlay,
  PlayerName,
  TilesWrapper,
  Tile,
} from "../chessBoardStyles";

const SpectatorBoard: FC<{ presetStates?: AllGamesStates }> = ({
  presetStates,
}) => {
  const [allTiles, setAllTiles] = useState<Position[]>();

  const [deadPiecesState, setDeadPiecesState] = useState<StatesOfPieces>();
  const theme = useContext(ThemeContext);

  const dispatch = useDispatch();

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

    if (presetStates) {
      dispatch(createGameInstance(presetStates.gamesStates[0]));
      dispatch(updateGameInstance(presetStates));
    } else {
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
    }
  }, []);

  useEffect(() => {
    setDeadPieces();
  }, []);

  const setDeadPieces = () => {
    const deadPieces = presetStates?.gamesStates[0]?.statesOfPieces
      ?.filter((x) => !x.alive)
      .sort((a, b) => b.timeCapturedTimestamp! - a.timeCapturedTimestamp!);
    setDeadPiecesState(deadPieces);
  };

  let currentTeam = presetStates?.gamesStates[0].currentTeam;

  return (
    <MainChessboardWrapper style={{ width: "350px" }}>
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
                    team={piece.team}
                    type={piece.type}
                  ></ChessPieceSmall>
                );
              })}
          </CapturedPiecesWrapperOverlay>
        </CapturedPiecesWrapper>
      </CapturedDivWrapper>
      <TilesWrapper>
        {allTiles?.map((tile, index) => {
          let pieces = presetStates?.gamesStates[0].statesOfPieces;
          let tiles = presetStates?.gamesStates[0].availableTiles;
          let matching = tiles?.find(
            (x) => JSON.stringify(x.position) === JSON.stringify(tile)
          );
          let piece = pieces?.find(
            (x) =>
              JSON.stringify(x.position) === JSON.stringify(tile) &&
              x.alive === true
          );
          let currentMoves = presetStates?.currentMovesState[0];
          let validMoves = currentMoves?.validMoves;
          let attackPath = presetStates?.gamesStates[0].checkStatus.attackPath;

          let checkingPieces =
            presetStates?.gamesStates[0].checkStatus.checkingPieces;
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
                style={{
                  boxShadow: validMoves?.find(
                    (x: Position) => x.x === tile.x && x.y === tile.y
                  )
                    ? "inset 0 0 30px #eeff00"
                    : tile.x === selectedX && tile.y === selectedY
                    ? `inset 0 0 30px ${theme!.colors.tertiary2}`
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
                  <ChessPieceSmall
                    key={index}
                    position={piece.position}
                    team={piece.team}
                    type={piece.type}
                  ></ChessPieceSmall>
                )}
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
                    team={piece.team}
                    type={piece.type}
                  ></ChessPieceSmall>
                );
              })}
          </CapturedPiecesWrapperOverlay>
        </CapturedPiecesWrapper>
      </CapturedDivWrapper>
    </MainChessboardWrapper>
  );
};

export default SpectatorBoard;
