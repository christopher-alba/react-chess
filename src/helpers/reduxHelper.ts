import {
  Team,
  Type,
  CheckType,
  MoveDirection,
  GameState,
} from "../types/enums";
import {
  AllGameStates,
  CurrentMoveState,
  MoveDetails,
  Position,
  StatesOfPiece,
  StatesOfPieces,
} from "../types/gameTypes";
import {
  calculateEnemyMoves,
  calculateValidMoves,
  calculateValidMovesCheckDetector,
} from "./moveHelper";

export const switchTeamsAndReset = (
  gameState: AllGameStates,
  currentMoveState: CurrentMoveState
) => {
  if (gameState?.currentTeam) {
    gameState.currentTeam =
      gameState.currentTeam === Team.Black ? Team.White : Team.Black;
  }
  currentMoveState.selectedPieceId = undefined;
};

export const findPieceById = (
  gameState: AllGameStates,
  pieceId: string
): StatesOfPiece => {
  return gameState?.statesOfPieces.find((piece) => piece.id === pieceId);
};


export const cloneGameState = (gameState): AllGameStates => {
  return JSON.parse(JSON.stringify(gameState));
};

export const cloneCurrentMoveState = (currentMoveState): CurrentMoveState => {
  return JSON.parse(JSON.stringify(currentMoveState));
};

export const checkForDiscoveredChecks = (
  gameState: AllGameStates,
  currentMoveState,
  selectedPiece,
  tile: Position
) => {
  // Logic to check for discovered checks

  //get all enemy pieces that could check the king
  let enemyTeamPieces = gameState?.statesOfPieces?.filter(
    (piece) => piece.team !== selectedPiece.team && piece.alive
  );
  let tempArray: MoveDetails[] = [];
  //get ally king
  let allyKing = gameState?.statesOfPieces?.find(
    (piece) => piece.type === Type.King && piece.team === selectedPiece.team
  );
  //get checking piece
  let checkingPiece = gameState.checkStatus.checkingPiece;
  //if checkingPiece is about to be killed by the move, set it to alive = false and remove the attack path
  if (
    checkingPiece &&
    checkingPiece.position.x === tile.x &&
    checkingPiece.position.y === tile.y
  ) {
    gameState.statesOfPieces.find(
      (piece) => piece.id === checkingPiece.id
    ).alive = false;
    gameState.checkStatus.attackPath = [];
    checkingPiece = undefined;
  }
  //if any enemy piece is about to be killed, make it alive = false and remove its attack path
  let enemyAboutToGetRekt = enemyTeamPieces.find(
    (piece) => piece.position.x === tile.x && piece.position.y === tile.y
  );
  if (enemyAboutToGetRekt) {
    enemyAboutToGetRekt.alive = false;
    enemyTeamPieces = enemyTeamPieces.filter(
      (x) => x.id !== enemyAboutToGetRekt.id
    );
  }

  if (currentMoveState && gameState && enemyTeamPieces) {
    //get all valid moves
    for (let i = 0; i < enemyTeamPieces?.filter((x) => x.alive).length; i++) {
      let moves = calculateValidMoves(
        enemyTeamPieces[i],
        gameState,
        currentMoveState.allEnemyMoves
      );
      Array.prototype.push.apply(tempArray, moves);
    }
  }
  let intersectingMove = tempArray.find(
    (move) => move.x === allyKing?.position.x && move.y === allyKing.position.y
  );

  return intersectingMove ? true : false;
};

export const recalculateValidMovesAndCheck = (
  gameState,
  currentMoveState,
  selectedPiece
) => {
  // Logic to recalculate valid moves and check for checkmate
  let enemyKing = gameState?.statesOfPieces.find(
    (piece) => piece.type === Type.King && piece.team !== selectedPiece.team
  );
  //recalculate all valid moves based on new move
  let currentTeamPieces = gameState?.statesOfPieces.filter(
    (piece) => piece.team === selectedPiece.team && piece.alive
  );
  if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
  if (currentMoveState && gameState && currentTeamPieces) {
    let tempArray: MoveDetails[] = [];
    for (let i = 0; i < currentTeamPieces?.length; i++) {
      let moves = calculateValidMovesCheckDetector(
        currentTeamPieces[i],
        gameState,
        currentMoveState.allEnemyMoves
      );
      Array.prototype.push.apply(tempArray, moves);
    }
    currentMoveState.validMoves = tempArray;
  }
  //find the intersecting move
  let intersectingMove = currentMoveState?.validMoves.find(
    (x) => x.x === enemyKing?.position.x && x.y === enemyKing.position.y
  );
  if (enemyKing && intersectingMove) {
    if (gameState) {
      gameState.checkStatus.type = CheckType.Check;
      gameState.checkStatus.teamInCheck = enemyKing.team;
      gameState.checkStatus.checkingPiece = intersectingMove.originPiece;
      gameState.checkStatus.attackPath = currentMoveState?.validMoves.filter(
        (move) =>
          move.moveDirection === intersectingMove.moveDirection &&
          intersectingMove.moveDirection !== MoveDirection.OneOff &&
          move.originPiece === intersectingMove.originPiece
      );
    }
  } else {
    if (gameState) {
      gameState.checkStatus.type = CheckType.None;
      gameState.checkStatus.teamInCheck = Team.None;
      gameState.checkStatus.checkingPiece = undefined;
      gameState.checkStatus.attackPath = [];
    }
  }
};

export const calculateCheckmateState = (
  gameToUpdate: AllGameStates,
  currentMoveState: CurrentMoveState
) => {
  //IMPLEMENT CHECKMATE CHECK
  //recalculate all enemy moves
  currentMoveState.allEnemyMoves = calculateEnemyMoves(gameToUpdate);
  //calculate all current team's moves
  let currentTeamPieces = gameToUpdate?.statesOfPieces.filter(
    (piece) => piece.team === gameToUpdate.currentTeam && piece.alive
  );
  if (currentMoveState && gameToUpdate && currentTeamPieces) {
    let tempArray: MoveDetails[] = [];
    for (let i = 0; i < currentTeamPieces?.length; i++) {
      let moves = calculateValidMoves(
        currentTeamPieces[i],
        gameToUpdate,
        currentMoveState.allEnemyMoves
      );
      Array.prototype.push.apply(tempArray, moves);
    }
    currentMoveState.validMoves = tempArray.filter(
      (x) => x.originPiece.team === gameToUpdate.currentTeam
    );
  }
  //if there are no moves, its a checkmate
  if (currentMoveState?.validMoves.length === 0) {
    if (gameToUpdate) {
      if (gameToUpdate.checkStatus.checkingPiece === undefined) {
        gameToUpdate.checkStatus.type = CheckType.None;
        gameToUpdate.gameState = GameState.Draw;
      } else {
        gameToUpdate.checkStatus.type = CheckType.Checkmate;
        gameToUpdate.gameState = GameState.WinnerDecided;
      }
    }
  } else {
    if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
  }
};

export const clearValidMoves = (currentMoveState) => {
  if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
};
