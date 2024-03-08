import {
  CheckType,
  Mode,
  MoveDirection,
  MoveType,
  Team,
  Type,
  ValidationType,
} from "../types/enums";
import {
  AllGameStates,
  CheckStatus,
  DirectionData,
  MoveDetails,
  Position,
  StatesOfPiece,
  StatesOfPieces,
  Tiles,
} from "../types/gameTypes";

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
      return filterMovesForCheckState(
        calculateBishopMoves(selectedPiece, currentGame, allEnemyMoves),
        currentGame.checkStatus
      );

    case Type.King:
      return calculateKingMoves(selectedPiece, currentGame, allEnemyMoves);

    case Type.Knight:
      return filterMovesForCheckState(
        calculateKnightMoves(selectedPiece, currentGame, allEnemyMoves),
        currentGame.checkStatus
      );
    case Type.Pawn:
      return filterMovesForCheckState(
        calculatePawnMoves(selectedPiece, currentGame, allEnemyMoves),
        currentGame.checkStatus
      );
    case Type.Queen:
      return filterMovesForCheckState(
        calculateQueenMoves(selectedPiece, currentGame, allEnemyMoves),
        currentGame.checkStatus
      );
    case Type.Rook:
      return filterMovesForCheckState(
        calculateRookMoves(selectedPiece, currentGame, allEnemyMoves),
        currentGame.checkStatus
      );
    default:
      return [];
  }
};
const filterMovesForCheckState = (
  movesToFilter: MoveDetails[],
  checkStatus: CheckStatus
) => {
  if (
    checkStatus.attackPath &&
    checkStatus.checkingPiece &&
    checkStatus.type === CheckType.Check
  ) {
    return movesToFilter.filter((obj) =>
      isMatch(
        checkStatus.attackPath as MoveDetails[],
        checkStatus.checkingPiece as StatesOfPiece,
        obj
      )
    );
  }

  return movesToFilter;
};

const isMatch = (
  attackPath: MoveDetails[],
  checkingPiece: StatesOfPiece,
  obj: MoveDetails
) => {
  return (
    attackPath.some((item) => item.x === obj.x && item.y === obj.y) ||
    (obj.x === checkingPiece.position.x && obj.y === checkingPiece.position.y)
  );
};

export const calculateValidMovesCheckDetector = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  allEnemyMoves: MoveDetails[]
) => {
  //Check what type of piece it is
  switch (selectedPiece.type) {
    case Type.Bishop:
      return calculateBishopMovesCheckDetector(
        selectedPiece,
        currentGame,
        allEnemyMoves
      );
    case Type.King:
      return calculateKingMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.Knight:
      return calculateKnightMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.Pawn:
      return calculatePawnMoves(selectedPiece, currentGame, allEnemyMoves);
    case Type.Queen:
      return calculateQueenMovesCheckDetector(
        selectedPiece,
        currentGame,
        allEnemyMoves
      );
    case Type.Rook:
      return calculateRookMovesCheckDetector(
        selectedPiece,
        currentGame,
        allEnemyMoves
      );
    default:
      return [];
  }
};

const calculateKnightMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
      });
    }
  }
  return knightMoves;
};

const calculateRookMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
) => {
  let rookMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  // Define directions for queen movement
  const directions: DirectionData[] = defineOnlyCross();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    rookMoves,
    ValidationType.Default
  );

  return rookMoves;
};

const calculateRookMovesCheckDetector = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
) => {
  let rookMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  // Define directions for queen movement
  const directions: DirectionData[] = defineOnlyCross();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    rookMoves,
    ValidationType.CheckDetector
  );
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

  // Define directions for queen movement
  const directions: DirectionData[] = defineOnlyCross();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    rookMoves,
    ValidationType.Enemy
  );

  return rookMoves;
};

const calculateQueenMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
) => {
  let queenMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;
  // Define directions for queen movement
  const directions: DirectionData[] = defineAllDirections();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    queenMoves,
    ValidationType.Default
  );
  return queenMoves;
};

const iterateDirections = (
  directions: DirectionData[],
  selectedPiece: StatesOfPiece,
  maxLength: number,
  availableTiles: Tiles,
  pieces: StatesOfPieces,
  movesArray: MoveDetails[],
  validationType: ValidationType
) => {
  for (const direction of directions) {
    let { dx, dy } = direction;
    let x = selectedPiece.position.x + dx;
    let y = selectedPiece.position.y + dy;

    // Move until the edge of the board or until obstructed by another piece
    loop1: while (x >= 0 && x < maxLength && y >= 0 && y < maxLength) {
      loop2: for (let i = 0; i < availableTiles.length; i++) {
        let tile = availableTiles[i];
        let continueLooping: boolean;
        // Check if the position is a valid tile
        if (validationType === ValidationType.CheckDetector) {
          continueLooping = validateTileWithLoopingCheckDetector(
            tile.position,
            pieces,
            selectedPiece,
            direction.direction,
            movesArray,
            x,
            y
          );
        } else if (validationType === ValidationType.Enemy) {
          continueLooping = validateTileWithLoopingEnemy(
            tile.position,
            pieces,
            selectedPiece,
            movesArray,
            direction.direction,
            x,
            y
          );
        } else {
          continueLooping = validateTileWithLooping(
            tile.position,
            pieces,
            selectedPiece,
            direction.direction,
            movesArray,
            x,
            y
          );
        }
        if (!continueLooping) break loop1;
      }
      x += dx;
      y += dy;
    }
  }
};

const defineAllDirections = () => {
  return [
    { dx: 1, dy: 0, direction: MoveDirection.Right }, // Right
    { dx: -1, dy: 0, direction: MoveDirection.Left }, // Left
    { dx: 0, dy: 1, direction: MoveDirection.Down }, // Down
    { dx: 0, dy: -1, direction: MoveDirection.Up }, // Up
    { dx: 1, dy: 1, direction: MoveDirection.BottomRight }, // Diagonal: Bottom-right
    { dx: -1, dy: 1, direction: MoveDirection.BottomLeft }, // Diagonal: Bottom-left
    { dx: 1, dy: -1, direction: MoveDirection.UpperRight }, // Diagonal: Top-right
    { dx: -1, dy: -1, direction: MoveDirection.UpperLeft }, // Diagonal: Top-left
  ] as DirectionData[];
};

const defineOnlyDiagonals = () => {
  return [
    { dx: 1, dy: 1, direction: MoveDirection.BottomRight }, // Diagonal: Bottom-right
    { dx: -1, dy: 1, direction: MoveDirection.BottomLeft }, // Diagonal: Bottom-left
    { dx: 1, dy: -1, direction: MoveDirection.UpperRight }, // Diagonal: Top-right
    { dx: -1, dy: -1, direction: MoveDirection.UpperLeft }, // Diagonal: Top-left
  ] as DirectionData[];
};

const defineOnlyCross = () => {
  return [
    { dx: 1, dy: 0, direction: MoveDirection.Right }, // Right
    { dx: -1, dy: 0, direction: MoveDirection.Left }, // Left
    { dx: 0, dy: 1, direction: MoveDirection.Down }, // Down
    { dx: 0, dy: -1, direction: MoveDirection.Up }, // Up
  ] as DirectionData[];
};

const calculateQueenMovesCheckDetector = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
) => {
  let queenMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  // Define directions for queen movement
  const directions: DirectionData[] = defineAllDirections();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    queenMoves,
    ValidationType.CheckDetector
  );

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
  // Define directions for queen movement
  const directions: DirectionData[] = defineAllDirections();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    queenMoves,
    ValidationType.Enemy
  );
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
  let checkPath = currentGame.checkStatus.attackPath;
  let checkingPiece = currentGame.checkStatus.checkingPiece;

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
          allEnemyMoves,
          checkPath,
          checkingPiece
        );
      }
      //down
      if (tile.position.y === selectedPiece.position.y + 1) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves,
          checkPath,
          checkingPiece
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
          allEnemyMoves,
          checkPath,
          checkingPiece
        );
      }
      //right
      if (tile.position.x === selectedPiece.position.x + 1) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves,
          checkPath,
          checkingPiece
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
        allEnemyMoves,
        checkPath,
        checkingPiece
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
        allEnemyMoves,
        checkPath,
        checkingPiece
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
        allEnemyMoves,
        checkPath,
        checkingPiece
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
        allEnemyMoves,
        checkPath,
        checkingPiece
      );
    }
    if (
      !currentGame.teamStates.find(
        (x) => x.teamName === currentGame.currentTeam
      ).castlingStates.KingMoved
    ) {
      //white King side castling
      if (
        currentGame.currentTeam === Team.White &&
        isTileEmpty({ x: 5, y: 7 }, currentGame) &&
        isTileEmpty({ x: 6, y: 7 }, currentGame) &&
        !isTileUnderAttack({ x: 4, y: 7 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 5, y: 7 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 6, y: 7 }, allEnemyMoves) &&
        !hasKingRookMoved(currentGame) &&
        tile.position.x === 6 &&
        tile.position.y === 7
      ) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves,
          checkPath,
          checkingPiece
        );
      }

      //white Queen side castling
      if (
        currentGame.currentTeam === Team.White &&
        isTileEmpty({ x: 1, y: 7 }, currentGame) &&
        isTileEmpty({ x: 2, y: 7 }, currentGame) &&
        isTileEmpty({ x: 3, y: 7 }, currentGame) &&
        !isTileUnderAttack({ x: 2, y: 7 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 3, y: 7 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 4, y: 7 }, allEnemyMoves) &&
        !hasQueenRookMoved(currentGame) &&
        tile.position.x === 2 &&
        tile.position.y === 7
      ) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves,
          checkPath,
          checkingPiece
        );
      }

      //black King side castling
      if (
        currentGame.currentTeam === Team.Black &&
        isTileEmpty({ x: 5, y: 0 }, currentGame) &&
        isTileEmpty({ x: 6, y: 0 }, currentGame) &&
        !isTileUnderAttack({ x: 4, y: 0 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 5, y: 0 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 6, y: 0 }, allEnemyMoves) &&
        !hasKingRookMoved(currentGame) &&
        tile.position.x === 6 &&
        tile.position.y === 0
      ) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves,
          checkPath,
          checkingPiece
        );
      }

      //black Queen side castling
      if (
        currentGame.currentTeam === Team.Black &&
        isTileEmpty({ x: 1, y: 0 }, currentGame) &&
        isTileEmpty({ x: 2, y: 0 }, currentGame) &&
        isTileEmpty({ x: 3, y: 0 }, currentGame) &&
        !isTileUnderAttack({ x: 2, y: 0 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 3, y: 0 }, allEnemyMoves) &&
        !isTileUnderAttack({ x: 4, y: 0 }, allEnemyMoves) &&
        !hasQueenRookMoved(currentGame) &&
        tile.position.x === 2 &&
        tile.position.y === 0
      ) {
        validateKingTileStatic(
          tile.position,
          pieces,
          selectedPiece,
          kingMoves,
          allEnemyMoves,
          checkPath,
          checkingPiece
        );
      }
    }
  }
  return kingMoves;
};

const isTileUnderAttack = (
  tileCoordinates: Position,
  allEnemyMoves: MoveDetails[]
) => {
  let enemymovesInTile = allEnemyMoves.find(
    (move) => move.x === tileCoordinates.x && move.y === tileCoordinates.y
  );

  if (enemymovesInTile) return true;

  return false;
};

const isTileEmpty = (tileCoordinates: Position, currentGame: AllGameStates) => {
  //find piece inside the same tile coordinates from statesOfPieces
  let piece = currentGame.statesOfPieces.find(
    (piece) =>
      piece.position.x === tileCoordinates.x &&
      piece.position.y === tileCoordinates.y
  );

  if (piece) return false;

  return true;
};
const hasKingRookMoved = (currentGame: AllGameStates) => {
  let currentTeam = currentGame.currentTeam;

  let hasRookMoved = currentGame.teamStates.find(
    (team) => team.teamName === currentTeam
  ).castlingStates.KingRookMoved;

  return hasRookMoved;
};

const hasQueenRookMoved = (currentGame: AllGameStates) => {
  let currentTeam = currentGame.currentTeam;

  let hasRookMoved = currentGame.teamStates.find(
    (team) => team.teamName === currentTeam
  ).castlingStates.QueenRookMoved;

  return hasRookMoved;
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
          originPiece: selectedPiece,
        });
      }
      //down
      if (tile.position.y === selectedPiece.position.y + 1) {
        kingMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
          originPiece: selectedPiece,
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
          originPiece: selectedPiece,
        });
      }
      //right
      if (tile.position.x === selectedPiece.position.x + 1) {
        kingMoves.push({
          x: tile.position.x,
          y: tile.position.y,
          moveType: MoveType.AttackPath,
          moveDirection: MoveDirection.OneOff,
          originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
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
        originPiece: selectedPiece,
      });
    }
  }
  return kingMoves;
};

const calculatePawnMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
) => {
  let pawnMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;

  //ENPASSANT CHECKS BEGIN
  //if an allied enpassant piece is directly side by side an enemy enpassant piece, enpassant can be performed
  const currentTeam = currentGame.teamStates.find(
    (team) => team.teamName === currentGame.currentTeam
  );
  const enpassantStates = currentTeam.enpassantStates;
  for (let i = 0; i < enpassantStates.alliedEnpassantPawns.length; i++) {
    const alliedEnpassantPawn = enpassantStates.alliedEnpassantPawns[i];
    for (let j = 0; j < enpassantStates.enemyEnpassantPawns.length; j++) {
      const enemyEnpassantPawn = enpassantStates.enemyEnpassantPawns[j];
      if (
        Math.abs(
          alliedEnpassantPawn.position.x - enemyEnpassantPawn.position.x
        ) === 1 &&
        alliedEnpassantPawn.position.x === selectedPiece.position.x &&
        alliedEnpassantPawn.position.y === selectedPiece.position.y
      ) {
        if (currentTeam.teamName === Team.Black) {
          validateTileStatic(
            {
              x: enemyEnpassantPawn.position.x,
              y: enemyEnpassantPawn.position.y + 1,
            },
            pieces,
            selectedPiece,
            pawnMoves
          );
        } else if (currentTeam.teamName === Team.White) {
          validateTileStatic(
            {
              x: enemyEnpassantPawn.position.x,
              y: enemyEnpassantPawn.position.y - 1,
            },
            pieces,
            selectedPiece,
            pawnMoves
          );
        }
      }
    }
  }
  //ENPASSANT CHECKS END

  for (let i = 0; i < availableTiles.length; i++) {
    const tile = availableTiles[i];
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
            piece.position.y === tile.position.y &&
            piece.alive
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
            piece.position.y === tile.position.y &&
            piece.alive
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
            piece.position.y === tile.position.y &&
            piece.alive
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
            piece.position.y === tile.position.y &&
            piece.alive
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
          originPiece: selectedPiece,
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
          originPiece: selectedPiece,
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
          originPiece: selectedPiece,
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
          originPiece: selectedPiece,
        });
      }
    }
  }
  return pawnMoves;
};

const calculateBishopMovesCheckDetector = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
) => {
  let bishopMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  // Define directions for queen movement
  const directions: DirectionData[] = defineOnlyDiagonals();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    bishopMoves,
    ValidationType.CheckDetector
  );

  return bishopMoves;
};

const calculateBishopMoves = (
  selectedPiece: StatesOfPiece,
  currentGame: AllGameStates,
  _allEnemyMoves: MoveDetails[]
) => {
  let bishopMoves: MoveDetails[] = [];
  let availableTiles = currentGame.availableTiles;
  let pieces = currentGame.statesOfPieces;
  let maxLength = currentGame.mode === Mode.TwoPlayer ? 8 : 14;

  // Define directions for queen movement
  const directions: DirectionData[] = defineOnlyDiagonals();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    bishopMoves,
    ValidationType.Default
  );

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
  // Define directions for queen movement
  const directions: DirectionData[] = defineOnlyDiagonals();

  // Iterate over directions
  iterateDirections(
    directions,
    selectedPiece,
    maxLength,
    availableTiles,
    pieces,
    bishopMoves,
    ValidationType.Enemy
  );

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
      originPiece: selectedPiece,
    });
  }
};

const validateKingTileStatic = (
  tile: Position,
  pieces: StatesOfPieces,
  selectedPiece: StatesOfPiece,
  movesArray: MoveDetails[],
  allEnemyMoves: MoveDetails[],
  checkPath?: MoveDetails[],
  _checkingPiece?: StatesOfPiece
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
    //if the tile is in the attack path of a checking piece
    if (checkPath?.find((path) => path.x === tile.x && path.y === tile.y)) {
      return;
    }

    movesArray.push({
      x: tile.x,
      y: tile.y,
      moveType: MoveType.DefaultMove,
      moveDirection: MoveDirection.OneOff,
      originPiece: selectedPiece,
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
      originPiece: selectedPiece,
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
          originPiece: selectedPiece,
        });
        return true;
      } else {
        //if enemy piece is on the tile
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.AttackPath,
          moveDirection: direction,
          originPiece: selectedPiece,
        });
        return false;
      }
    } else {
      movesArray.push({
        x: tile.x,
        y: tile.y,
        moveType: MoveType.AttackPath,
        moveDirection: direction,
        originPiece: selectedPiece,
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
          originPiece: selectedPiece,
        });
        return true;
      } else {
        //if enemy piece is on the tile
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.DefaultMove,
          moveDirection: direction,
          originPiece: selectedPiece,
        });
        return false;
      }
    }
    return false;
  }
  return true;
};

const validateTileWithLoopingCheckDetector = (
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
      let enemyPiece = pieces.find(
        (piece) =>
          piece.team !== selectedPiece.team &&
          tile.x === piece.position.x &&
          tile.y === piece.position.y &&
          piece.alive === true
      );
      if (!enemyPiece) {
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.DefaultMove,
          moveDirection: direction,
          originPiece: selectedPiece,
        });
        return true;
      } else {
        //if enemy piece is on the tile
        movesArray.push({
          x: tile.x,
          y: tile.y,
          moveType: MoveType.DefaultMove,
          moveDirection: direction,
          originPiece: selectedPiece,
        });
        if (enemyPiece.type === Type.King) {
          return true;
        }
        return false;
      }
    }
    return false;
  }
  return true;
};
