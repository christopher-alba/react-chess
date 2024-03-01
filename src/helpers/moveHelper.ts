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
      return [];
    case Type.Pawn:
      return calculatePawnMoves(selectedPiece, currentGame);
    case Type.Queen:
      return [];
    case Type.Rook:
      return [];
    default:
      return [];
  }
};

const calculateKingMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let kingMoves: Position[] = [];
  calculateDiagonalBottomLeftMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.y + 1
  );
  calculateDiagonalBottomRightMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.y + 1
  );
  calculateDiagonalUpperLeftMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.y - 1
  );
  calculateDiagonalUpperRightMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.y - 1
  );
  calculateUpwardMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.y - 1
  );
  calculateDownwardMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.y + 1
  );

  calculateLeftMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.x - 1
  );

  calculateRightMoves(
    selectedPiece,
    currentGame,
    kingMoves,
    selectedPiece.position.x + 1
  );

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
//up
const calculateUpwardMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  lowerYLimit: number
) => {
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let x = selectedPiece.position.x;
  let y = selectedPiece.position.y - 1;
  while (y >= lowerYLimit) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) y = lowerYLimit - 1;
    }
    y--;
  }
};

//down
const calculateDownwardMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  upperYLimit: number
) => {
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let x = selectedPiece.position.x;
  let y = selectedPiece.position.y + 1;
  while (y < upperYLimit + 1) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) y = upperYLimit;
    }
    y++;
  }
};
//left
const calculateLeftMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  lowerXLimit: number
) => {
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let x = selectedPiece.position.x - 1;
  let y = selectedPiece.position.y;
  while (x > lowerXLimit - 1) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) x = lowerXLimit;
    }
    x--;
  }
};
//right
const calculateRightMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  upperXLimit: number
) => {
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let x = selectedPiece.position.x + 1;
  let y = selectedPiece.position.y;
  while (x < upperXLimit + 1) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) x = upperXLimit;
    }
    x++;
  }
};

//upper-right
const calculateDiagonalUpperRightMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  lowerYLimit: number
) => {
  let x = selectedPiece.position.x;
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  for (let y = selectedPiece.position.y - 1; y >= lowerYLimit; y--) {
    x++;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) y = 0;
    }
  }
};
//upper-left
const calculateDiagonalUpperLeftMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  lowerYLimit: number
) => {
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y - 1; y >= lowerYLimit; y--) {
    x--;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile tile
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) y = lowerYLimit - 1;
    }
  }
};

//bottom-left
const calculateDiagonalBottomLeftMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  upperYLimit: number
) => {
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let x = selectedPiece.position.x - 1;
  let y = selectedPiece.position.y + 1;
  while (y < upperYLimit + 1) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) y = upperYLimit;
    }
    x--;
    y++;
  }
};
//bottom-right
const calculateDiagonalBottomRightMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  movesArray: Position[],
  upperYLimit: number
) => {
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let x = selectedPiece.position.x + 1;
  let y = selectedPiece.position.y + 1;
  while (y < upperYLimit + 1) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      let continueLooping = validateTileWithLooping(
        tile.position,
        pieces,
        selectedPiece,
        movesArray,
        x,
        y
      );
      if (!continueLooping) y = upperYLimit;
    }
    x--;
    y++;
  }
};
const calculateBishopMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let bishopMoves: Position[] = [];
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;
  calculateDiagonalUpperLeftMoves(selectedPiece, currentGame, bishopMoves, 0);
  calculateDiagonalUpperRightMoves(selectedPiece, currentGame, bishopMoves, 0);
  calculateDiagonalBottomLeftMoves(
    selectedPiece,
    currentGame,
    bishopMoves,
    maxLength
  );
  calculateDiagonalBottomRightMoves(
    selectedPiece,
    currentGame,
    bishopMoves,
    maxLength
  );
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
