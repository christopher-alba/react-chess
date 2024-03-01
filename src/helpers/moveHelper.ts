import { Mode, Type } from "../types/enums";
import {
  AllGameStates,
  AllGamesStates,
  Position,
  StatesOfPiece,
  StatesOfPieces,
  Tile,
  Tiles,
} from "../types/gameTypes";

export const isValidMove = (state: AllGamesStates, movePosition: Position) => {
  return true;
};

export const calculateValidMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  //Check what type of piece it is
  switch (selectedPiece.type) {
    case Type.Bishop:
      return calculateBishopMoves(selectedPiece, currentGame);
    case Type.King:
      return [];
    case Type.Knight:
      return [];
    case Type.Pawn:
      return [];
    case Type.Queen:
      return [];
    case Type.Rook:
      return [];
    default:
      return [];
  }
};

const calculateBishopMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {

  let bishopMoves: Tiles = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;
  //upper-right
  let x = selectedPiece.position.x;
  for (
    let y = selectedPiece.position.y - 1;
    y >= 0;
    y--
  ) {
    x++;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTile(
        tile,
        pieces,
        selectedPiece,
        bishopMoves,
        x,
        y
      );
      if (!continueLooping) y = 0;
    }
  }

  //upper-left
  x = selectedPiece.position.x;
  for (
    let y = selectedPiece.position.y - 1;
    y >= 0;
    y--
  ) {
    x--;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTile(
        tile,
        pieces,
        selectedPiece,
        bishopMoves,
        x,
        y
      );
      if (!continueLooping) y = 0;
    }
  }

   //bottom-left
   x = selectedPiece.position.x;
   for (
     let y = selectedPiece.position.y + 1;
     y < maxLength;
     y++
   ) {
     x--;
     for (let i = 0; i < availableTiles.length; i++) {
       let tile = availableTiles[i];
       //if position is a valid tile tile
       let continueLooping = validateTile(
         tile,
         pieces,
         selectedPiece,
         bishopMoves,
         x,
         y
       );
       if (!continueLooping) y = maxLength;
     }
   }

   //bottom-right
   x = selectedPiece.position.x;
   for (
     let y = selectedPiece.position.y + 1;
     y < maxLength;
     y++
   ) {
     x++;
     for (let i = 0; i < availableTiles.length; i++) {
       let tile = availableTiles[i];
       //if position is a valid tile tile
       let continueLooping = validateTile(
         tile,
         pieces,
         selectedPiece,
         bishopMoves,
         x,
         y
       );
       if (!continueLooping) y = maxLength;
     }
   }
 

  return bishopMoves;
};

const validateTile = (
  tile: Tile,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: Tiles,
  x: number,
  y: number
) => {
  if (tile.position.x === x && tile.position.y === y) {
    //if no friendly pieces are on the tile
    if (
      !pieces.find(
        (piece) =>
          piece.team === selectedPiece.team &&
          piece.position.x === tile.position.x &&
          piece.position.y === tile.position.y
      )
    ) {
      //if no enemy pieces are on the tile
      if (
        !pieces.find(
          (piece) =>
            piece.team !== selectedPiece.team &&
            tile.position.x === piece.position.x &&
            tile.position.y === piece.position.y
        )
      ) {
        movesArray.push(tile);
        return true;
      } else {
        //if enemy piece is on the tile
        movesArray.push(tile);
        return false;
      }
    }
    return false;
  }
  return true;
};
