import {
  CheckType,
  Mode,
  MoveDirection,
  MoveType,
  Team,
  Type,
} from "../types/enums";
import {
  AllGameStates,
  AllGamesStates,
  MoveDetails,
  Position,
  StatesOfPiece,
  StatesOfPieces,
} from "../types/gameTypes";

export const isValidMove = (state: AllGamesStates, movePosition: Position) => {
  return true;
};
export const calculateEnemyMoves = (currentGame: AllGameStates) => {
  let enemyMoves: MoveDetails[] = [];
  let enemyPieces = currentGame.statesOfPieces.filter(
    (x) => x.team !== currentGame.currentTeam && x.alive === true
  );
  for (let i = 0; i < enemyPieces.length; i++) {
    Array.prototype.push.apply(
      enemyMoves,
      calculateValidEnemyMoves(enemyPieces[i], currentGame)
    );
  }
  console.log(enemyMoves);

  return enemyMoves;
};

export const calculateValidEnemyMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  //Check what type of piece it is
  switch (selectedPiece.type) {
    case Type.Bishop:
      return calculateEnemyBishopMoves(selectedPiece, currentGame);
    case Type.King:
      return calculateEnemyKingMoves(selectedPiece, currentGame);
    case Type.Knight:
      return calculateEnemyKnightMoves(selectedPiece, currentGame);
    case Type.Pawn:
      return calculateEnemyPawnMoves(selectedPiece, currentGame);
    case Type.Queen:
      return calculateEnemyQueenMoves(selectedPiece, currentGame);
    case Type.Rook:
      return calculateEnemyRookMoves(selectedPiece, currentGame);
    default:
      return [];
  }
};
export const calculateValidMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  //Check what type of piece it is
  switch (selectedPiece.type) {
    case Type.Bishop:
      return calculateBishopMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.King:
      return calculateKingMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.Knight:
      return calculateKnightMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.Pawn:
      return calculatePawnMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.Queen:
      return calculateQueenMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.Rook:
      return calculateRookMoves(selectedPiece, currentGame, allEnemyMoves);
    default:
      return [];
  }
};
const calculateKnightMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  let knightMoves: MoveDetails[] = [];
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

const calculateEnemyKnightMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let knightMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  for (let i = 0; i < availableTiles.length; i++) {
    let tile = availableTiles[i];
    if (
      tile.position.y === selectedPiece.position.y - 2 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    if (
      tile.position.y === selectedPiece.position.y - 2 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x - 2
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x + 2
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    if (
      tile.position.y === selectedPiece.position.y + 2 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    if (
      tile.position.y === selectedPiece.position.y + 2 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x - 2
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x + 2
    ) {
      knightMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
  }
  return knightMoves;
};

const calculateRookMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  let rookMoves: MoveDetails[] = [];
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
        MoveDirection.Up,
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
        MoveDirection.Down,
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
        MoveDirection.Right,
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
        MoveDirection.Left,
        rookMoves,
        x,
        y
      );
      if (!continueLooping) x = -1;
    }
  }

  return rookMoves;
};

const calculateEnemyRookMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let rookMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  //up
  let x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y + 1; y < maxLength; y++) {
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];
      //if position is a valid tile
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        MoveDirection.Up,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        MoveDirection.Down,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        MoveDirection.Right,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        rookMoves,
        MoveDirection.Left,
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
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  let queenMoves: MoveDetails[] = [];
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
        MoveDirection.UpperRight,
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
        MoveDirection.UpperLeft,
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
        MoveDirection.BottomLeft,
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
        MoveDirection.BottomRight,
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
        MoveDirection.Up,
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
        MoveDirection.Down,
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
        MoveDirection.Right,
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
        MoveDirection.Left,
        queenMoves,
        x,
        y
      );
      if (!continueLooping) x = -1;
    }
  }
  return queenMoves;
};

const calculateEnemyQueenMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let queenMoves: MoveDetails[] = [];
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.UpperRight,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.UpperLeft,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.BottomLeft,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.BottomRight,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.Up,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.Down,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.Right,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        queenMoves,
        MoveDirection.Left,
        x,
        y
      );
      if (!continueLooping) x = -1;
    }
  }
  return queenMoves;
};

export const calculateKingMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  let kingMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;

  for (let i = 0; i < availableTiles.length; i++) {
    let tile = availableTiles[i];
    if (tile.position.x === selectedPiece.position.x) {
      //up
      if (tile.position.y === selectedPiece.position.y - 1) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves
        );
      }
      //down
      if (tile.position.y === selectedPiece.position.y + 1) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves
        );
      }
    }
    if (tile.position.y === selectedPiece.position.y) {
      //left
      if (tile.position.x === selectedPiece.position.x - 1) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves
        );
      }
      //right
      if (tile.position.x === selectedPiece.position.x + 1) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves
        );
      }
    }
    //bottom right
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      validateKingTileStatic(
        tile.position,
        pieces,
        selectedPiece,
        kingMoves,
        allEnemyMoves
      );
    }
    //bottom left
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      validateKingTileStatic(
        tile.position,
        pieces,
        selectedPiece,
        kingMoves,
        allEnemyMoves
      );
    }
    //upper left
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      validateKingTileStatic(
        tile.position,
        pieces,
        selectedPiece,
        kingMoves,
        allEnemyMoves
      );
    }
    //upper right
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      validateKingTileStatic(
        tile.position,
        pieces,
        selectedPiece,
        kingMoves,
        allEnemyMoves
      );
    }
  }
  return kingMoves;
};

const calculateEnemyKingMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let kingMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;

  for (let i = 0; i < availableTiles.length; i++) {
    let tile = availableTiles[i];
    if (tile.position.x === selectedPiece.position.x) {
      //up
      if (tile.position.y === selectedPiece.position.y - 1) {
        kingMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
      //down
      if (tile.position.y === selectedPiece.position.y + 1) {
        kingMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
    }
    if (tile.position.y === selectedPiece.position.y) {
      //left
      if (tile.position.x === selectedPiece.position.x - 1) {
        kingMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
      //right
      if (tile.position.x === selectedPiece.position.x + 1) {
        kingMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
    }
    //bottom right
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      kingMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    //bottom left
    if (
      tile.position.y === selectedPiece.position.y + 1 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      kingMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    //upper left
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x - 1
    ) {
      kingMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
    //upper right
    if (
      tile.position.y === selectedPiece.position.y - 1 &&
      tile.position.x === selectedPiece.position.x + 1
    ) {
      kingMoves.push({
        x: tile.position.x,
        y: tile.position.y,
        moveType: MoveType.AttackPath,
        moveDirection: MoveDirection.OneOff,
      });
    }
  }
  return kingMoves;
};

const calculatePawnMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  let pawnMoves: MoveDetails[] = [];
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

const calculateEnemyPawnMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let pawnMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;

  for (let i = 0; i < availableTiles.length; i++) {
    let tile = availableTiles[i];
    if (selectedPiece.team === Team.White) {
      //possible 2 sideward moves
      if (
        tile.position.x === selectedPiece.position.x - 1 &&
        tile.position.y === selectedPiece.position.y - 1
      ) {
        pawnMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
      if (
        tile.position.x === selectedPiece.position.x + 1 &&
        tile.position.y === selectedPiece.position.y - 1
      ) {
        pawnMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
    } else if (selectedPiece.team === Team.Black) {
      //possible 2 sideward moves
      if (
        tile.position.x === selectedPiece.position.x - 1 &&
        tile.position.y === selectedPiece.position.y + 1
      ) {
        pawnMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
      if (
        tile.position.x === selectedPiece.position.x + 1 &&
        tile.position.y === selectedPiece.position.y + 1
      ) {
        pawnMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
        });
      }
    }
  }
  return pawnMoves;
};

const calculateBishopMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  let bishopMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  //upper-right
  let x = selectedPiece.position.x;
  for (let y = selectedPiece.position.y - 1; y >= 0; y--) {
    x++;
    for (let i = 0; i < availableTiles.length; i++) {
      let tile = availableTiles[i];

      if (currentGame.checkStatus.type === CheckType.Check) {
        //check for intersects with checking piece's attack path
      } else {
        let continueLooping = validateTileWithLooping(
          tile.position,
          pieces,
          selectedPiece,
          MoveDirection.BottomRight,
          bishopMoves,
          x,
          y
        );
        if (!continueLooping) y = 0;
      }
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
        MoveDirection.BottomRight,
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
        MoveDirection.BottomRight,
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
        MoveDirection.BottomRight,
        bishopMoves,
        x,
        y
      );
      if (!continueLooping) y = maxLength;
    }
  }

  return bishopMoves;
};

const calculateEnemyBishopMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates
) => {
  let bishopMoves: MoveDetails[] = [];
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        bishopMoves,
        MoveDirection.UpperRight,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        bishopMoves,
        MoveDirection.UpperLeft,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        bishopMoves,
        MoveDirection.BottomLeft,
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
      let continueLooping = validateTileWithLoopingEnemy(
        tile.position,
        pieces,
        selectedPiece,
        bishopMoves,
        MoveDirection.BottomRight,
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
  movesArray: MoveDetails[]
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
    movesArray.push({
      x: tile.x,
      y: tile.y,
      moveType: MoveType.DefaultMove,
      moveDirection: MoveDirection.OneOff,
    });
  }
};

const validateKingTileStatic = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: MoveDetails[],
  allEnemyMoves: MoveDetails[]
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
    //if the tile intersects with any enemy moves and selected piece is a king

    if (selectedPiece.type === Type.King) {
      let intersects = allEnemyMoves.find(
        (move) => move.x === tile.x && move.y === tile.y
      );
      console.log("move intersects", intersects?.x, intersects?.y);
      if (intersects) return;
    }

    movesArray.push({
      x: tile.x,
      y: tile.y,
      moveType: MoveType.DefaultMove,
      moveDirection: MoveDirection.OneOff,
    });
  }
};

const validateTileForwardPawn = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: MoveDetails[]
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
    movesArray.push({
      x: tile.x,
      y: tile.y,
      moveType: MoveType.DefaultMove,
      moveDirection: MoveDirection.OneOff,
    });
    return false;
  }
  return true;
};

const validateTileWithLoopingEnemy = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: MoveDetails[],
  direction: MoveDirection,
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
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.AttackPath,
          moveDirection: direction,
        });
        return true;
      } else {
        //if enemy piece is on the tile
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.AttackPath,
          moveDirection: direction,
        });
        return false;
      }
    } else {
      movesArray.push({
        x: tile.x,
        y: tile.y,
        moveType: MoveType.AttackPath,
        moveDirection: direction,
      });
      return false;
    }
  }
  return true;
};

const validateTileWithLooping = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  direction: MoveDirection,
  movesArray: MoveDetails[],
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
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.DefaultMove,
          moveDirection: direction,
        });
        return true;
      } else {
        //if enemy piece is on the tile
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.DefaultMove,
          moveDirection: direction,
        });
        return false;
      }
    }
    return false;
  }
  return true;
};
