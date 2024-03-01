import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGameInstance, makeMove } from "../redux/slices/gameStateSlice";
import { v4 as uuidv4 } from "uuid";
import { GameState, Mode, Team, TileColor, Type } from "../types/enums";
import {
  AllGameStates,
  Position,
  StatesOfPieces,
  Tiles,
} from "../types/gameTypes";
import styled from "styled-components";
import ChessPiece from "./ChessPiece";
import { RootState } from "../redux/store";

const ChessBoard: FC = () => {
  const [tiles, setTiles] = useState<Tiles>();
  const [allTiles, setAllTiles] = useState<Position[]>();
  const [gameId, setGameId] = useState<string>();
  const dispatch = useDispatch();
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);

  const handleTileClick = (
    tile: Position,
    validMoves?: Tiles,
    selectedPieceId?: string
  ) => {
    if (
      validMoves?.find(
        (move) => move.position.x === tile.x && move.position.y === tile.y
      )
    ) {
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
    setTiles(tilesArray);
    return tilesArray;
  };
  const initialize2PlayerBoardPieces = (): StatesOfPieces => {
    let pieces: StatesOfPieces = [];
    //black pieces
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
      position: { x: 3, y: 0 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.King,
    });
    pieces.push({
      position: { x: 4, y: 0 },
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
      position: { x: 3, y: 7 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.King,
    });
    pieces.push({
      position: { x: 4, y: 7 },
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
    pieces.push({
      position: { x: 3, y: 2 },
      alive: true,
      team: Team.White,
      id: uuidv4(),
      type: Type.Bishop,
    });
    pieces.push({
      position: { x: 2, y: 2 },
      alive: true,
      team: Team.Black,
      id: uuidv4(),
      type: Type.Bishop,
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
    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 14; x++) {
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
          },
          {
            teamName: Team.Black,
            alive: true,
            winner: false,
          },
        ],
        gameState: GameState.Stopped,
        availableTiles: initialize2PlayerBoardTiles(),
        statesOfPieces: initialize2PlayerBoardPieces(),
      })
    );
  }, []);

  return (
    <TilesWrapper>
      {allTiles?.map((tile) => {
        let pieces = reduxState.gamesStates.find(
          (x) => x.gameId === gameId
        )?.statesOfPieces;
        let matching = tiles?.find(
          (x) => JSON.stringify(x.position) === JSON.stringify(tile)
        );
        let piece = pieces?.find(
          (x) => JSON.stringify(x.position) === JSON.stringify(tile)
        );
        let currentMoves = reduxState.currentMovesState.find(
          (x) => x.gameId === gameId
        );
        let validMoves = currentMoves?.validMoves;
        let selectedPieceId = currentMoves?.selectedPieceId;
        let selectedPiecePos = pieces?.find(
          (x) => x.id === selectedPieceId
        )?.position;
        let selectedX = selectedPiecePos?.x;
        let selectedY = selectedPiecePos?.y;
        if (matching) {
          return (
            <Tile
              onMouseDown={() => {
                handleTileClick(tile, validMoves, selectedPieceId);
              }}
              style={{
                boxShadow: validMoves?.find(
                  (x) => x.position.x === tile.x && x.position.y === tile.y
                )
                  ? "inset 0 0 30px #00f"
                  : tile.x === selectedX && tile.y === selectedY
                  ? "inset 0 0 30px #33ff00"
                  : "",
                background:
                  matching.color === TileColor.Dark ? "brown" : "gray",
              }}
              className={`x-${tile.x} y-${tile.y}`}
            >
              {piece && piece.alive && (
                <ChessPiece
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
          return <Tile></Tile>;
        }
      })}
    </TilesWrapper>
  );
};

const Tile = styled("div")`
  height: calc(800px / 14);
  width: calc(800px / 14);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TilesWrapper = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  width: 800px;
  height: 800px;
`;

export default ChessBoard;
