import { Mode, Team, Type } from "../types/enums";
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
      return calculateKingMoves(selectedPiece, currentGame);
    case Type.Knight:
      return calculateKnightMoves(selectedPiece, currentGame);
    case Type.Pawn:
      return calculatePawnMoves(selectedPiece, currentGame);
    case Type.Queen:
      return calculateQueenMoves(selectedPiece, currentGame);
    case Type.Rook:
      return calculateRookMoves(selectedPiece, currentGame);
    default:
      return [];
  }
};
const calculateKnightMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let knightMoves: Position[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  for (let i = 0; i < availableTiles.length; i++) {
    let tile = availableTiles[i];
    if (
      tile.position.y === selectedPiece.position.y - 2 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
    if (
      tile.position.y === selectedPiece.position.y - 2 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x - 2
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x + 2
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
    if (
      tile.position.y === selectedPiece.position.y + 2 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
    if (
      tile.position.y === selectedPiece.position.y + 2 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x - 2
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x + 2
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, knightMoves);
    }
  }
  return knightMoves;
};
const calculateRookMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let rookMoves: Position[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  //up
  let x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y + 1; y < maxLength; y++) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        x,
        y
      );
      if (!continueLooping) y = maxLength;
    }
  }
  //down
  x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y - 1; y > 0; y--) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        x,
        y
      );
      if (!continueLooping) y = 0;
    }
  }

  //right
  let y = selectedPiece.position.y;
  for (let x = selectedPiece.position.x + 1; x < maxLength; x++) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        x,
        y
      );
      if (!continueLooping) x = maxLength;
    }
  }
  //left
  y = selectedPiece.position.y;
  for (let x = selectedPiece.position.x - 1; x >= 0; x--) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        x,
        y
      );
      if (!continueLooping) x = -1;
    }
  }

  return rookMoves;
};
const calculateQueenMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let queenMoves: Position[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;
  //upper-right
  let x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y - 1; y >= 0; y--) {
    x++;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) y = 0;
    }
  }

  //upper-left
  x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y - 1; y >= 0; y--) {
    x--;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) y = 0;
    }
  }

  //bottom-left
  x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y + 1; y < maxLength; y++) {
    x--;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) y = maxLength;
    }
  }

  //bottom-right
  x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y + 1; y < maxLength; y++) {
    x++;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) y = maxLength;
    }
  }

  //up
  x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y + 1; y < maxLength; y++) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) y = maxLength;
    }
  }
  //down
  x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y - 1; y > 0; y--) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) y = 0;
    }
  }

  //right
  let y = selectedPiece.position.y;
  for (let x = selectedPiece.position.x + 1; x < maxLength; x++) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) x = maxLength;
    }
  }
  //left
  y = selectedPiece.position.y;
  for (let x = selectedPiece.position.x - 1; x >= 0; x--) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) x = -1;
    }
  }
  return queenMoves;
};

const calculateKingMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let kingMoves: Position[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;

  for (let i = 0; i < availableTiles.length; i++) {
    let tile = availableTiles[i];
    if (tile.position.x === selectedPiece.position.x) {
      //up
      if (tile.position.y === selectedPiece.position.y - 1) {
        validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
      }
      //down
      if (tile.position.y === selectedPiece.position.y + 1) {
        validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
      }
    }
    if (tile.position.y === selectedPiece.position.y) {
      //left
      if (tile.position.x === selectedPiece.position.x - 1) {
        validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
      }
      //right
      if (tile.position.x === selectedPiece.position.x + 1) {
        validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
      }
    }
    //bottom right
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
    }
    //bottom left
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
    }
    //upper left
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
    }
    //upper right
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      validateTileStatic(tile.position, pieces, selectedPiece, kingMoves);
    }
  }
  return kingMoves;
};
const calculatePawnMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let pawnMoves: Position[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;

  for (let i = 0; i < availableTiles.length; i++) {
    let tile = availableTiles[i];
    if (selectedPiece.team === Team.White) {
      //initial 2 forward moves
      if (selectedPiece.position.y === 6) {
        if (
          tile.position.x === selectedPiece.position.x &&
          tile.position.y === 5
        ) {
          for (let j = 0; j < 2; j++) {
            const stopLoop = validateTileForwardPawn(
              { x: tile.position.x, y: tile.position.y - j },
              pieces,
              selectedPiece,
              pawnMoves
            );
            if (stopLoop) break;
          }
        }
      }
      //possible 2 sideward moves
      if (
        tile.position.x === selectedPiece.position.x - 1 &&
        tile.position.y === selectedPiece.position.y - 1 &&
        pieces.find(
          (piece) =>
            piece.position.x === tile.position.x &&
            piece.position.y === tile.position.y
        )
      ) {
        validateTileStatic(tile.position, pieces, selectedPiece, pawnMoves);
      }
      if (
        tile.position.x === selectedPiece.position.x + 1 &&
        tile.position.y === selectedPiece.position.y - 1 &&
        pieces.find(
          (piece) =>
            piece.position.x === tile.position.x &&
            piece.position.y === tile.position.y
        )
      ) {
        validateTileStatic(tile.position, pieces, selectedPiece, pawnMoves);
      }
      //single forward move
      if (
        tile.position.x === selectedPiece.position.x &&
        tile.position.y === selectedPiece.position.y - 1
      ) {
        validateTileForwardPawn(
          tile.position,
          pieces,
          selectedPiece,
          pawnMoves
        );
      }
    } else if (selectedPiece.team === Team.Black) {
      //initial 2 forward moves
      if (selectedPiece.position.y === 1) {
        if (
          tile.position.x === selectedPiece.position.x &&
          tile.position.y === 2
        ) {
          for (let j = 0; j < 2; j++) {
            const stopLoop = validateTileForwardPawn(
              { x: tile.position.x, y: tile.position.y + j },
              pieces,
              selectedPiece,
              pawnMoves
            );
            if (stopLoop) break;
          }
        }
      }
      //possible 2 sideward moves
      if (
        tile.position.x === selectedPiece.position.x - 1 &&
        tile.position.y === selectedPiece.position.y + 1 &&
        pieces.find(
          (piece) =>
            piece.position.x === tile.position.x &&
            piece.position.y === tile.position.y
        )
      ) {
        validateTileStatic(tile.position, pieces, selectedPiece, pawnMoves);
      }
      if (
        tile.position.x === selectedPiece.position.x + 1 &&
        tile.position.y === selectedPiece.position.y + 1 &&
        pieces.find(
          (piece) =>
            piece.position.x === tile.position.x &&
            piece.position.y === tile.position.y
        )
      ) {
        validateTileStatic(tile.position, pieces, selectedPiece, pawnMoves);
      }
      //single forward move
      if (
        tile.position.x === selectedPiece.position.x &&
        tile.position.y === selectedPiece.position.y + 1
      ) {
        validateTileForwardPawn(
          tile.position,
          pieces,
          selectedPiece,
          pawnMoves
        );
      }
    }
  }
  return pawnMoves;
};

const calculateBishopMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let bishopMoves: Position[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;
  //upper-right
  let x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y - 1; y >= 0; y--) {
    x++;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
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
  for (let y = selectedPiece.position.y - 1; y >= 0; y--) {
    x--;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
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
  for (let y = selectedPiece.position.y + 1; y < maxLength; y++) {
    x--;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
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
  for (let y = selectedPiece.position.y + 1; y < maxLength; y++) {
    x++;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLooping(
        tile.position,
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

const validateTileStatic = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: Position[]
) => {
  //if no friendly pieces are on the tile
  if (
    !pieces.find(
      (piece) =>
        piece.team === selectedPiece.team &&
        piece.position.x === tile.x &&
        piece.position.y === tile.y &&
        piece.alive === true
    )
  ) {
    movesArray.push(tile);
  }
};

const validateTileForwardPawn = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: Position[]
) => {
  //if no friendly pieces and enemies are on the tile
  if (
    !pieces.find(
      (piece) =>
        piece.team === selectedPiece.team &&
        piece.position.x === tile.x &&
        piece.position.y === tile.y &&
        piece.alive === true
    ) &&
    !pieces.find(
      (piece) =>
        piece.team !== selectedPiece.team &&
        piece.position.x === tile.x &&
        piece.position.y === tile.y &&
        piece.alive === true
    )
  ) {
    movesArray.push(tile);
    return false;
  }
  return true;
};

const validateTileWithLooping = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: Position[],
  x: number,
  y: number
) => {
  if (tile.x === x && tile.y === y) {
    //if no friendly pieces are on the tile
    if (
      !pieces.find(
        (piece) =>
          piece.team === selectedPiece.team &&
          piece.position.x === tile.x &&
          piece.position.y === tile.y &&
          piece.alive === true
      )
    ) {
      //if no enemy pieces are on the tile
      if (
        !pieces.find(
          (piece) =>
            piece.team !== selectedPiece.team &&
            tile.x === piece.position.x &&
            tile.y === piece.position.y &&
            piece.alive === true
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
