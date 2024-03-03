import { Team, Type, CheckType, MoveDirection } from "../types/enums";
import {
  AllGameStates,
  CurrentMoveState,
  MoveDetails,
  StatesOfPiece,
} from "../types/gameTypes";
import {
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

export const findEnemyPiece = (gameState, selectedPiece, tile) => {
  return gameState?.statesOfPieces.find(
    (piece) =>
      piece.team !== selectedPiece?.team &&
      piece.position.x === tile.x &&
      piece.position.y === tile.y
  );
};

export const cloneGameState = (gameState): AllGameStates => {
  return JSON.parse(JSON.stringify(gameState));
};

export const cloneCurrentMoveState = (currentMoveState): CurrentMoveState => {
  return JSON.parse(JSON.stringify(currentMoveState));
};

export const checkForDiscoveredChecks = (
  gameState,
  currentMoveState,
  selectedPiece
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
  if (currentMoveState && gameState && enemyTeamPieces) {
    //get all valid moves
    for (let i = 0; i < enemyTeamPieces?.length; i++) {
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

export const calculateCheckmateState = (gameToUpdate, currentMoveState) => {
  //IMPLEMENT CHECKMATE CHECK
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
      gameToUpdate.checkStatus.type = CheckType.Checkmate;
    }
  } else {
    console.log(currentMoveState?.validMoves);

    if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
  }
};

export const clearValidMoves = (currentMoveState) => {
  if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
};
