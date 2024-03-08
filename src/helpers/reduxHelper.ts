import { PayloadAction } from "@reduxjs/toolkit";
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
  TeamState,
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

export const handleCastling = (
  gameToUpdate: AllGameStates,
  action: PayloadAction<{
    currentGameId: string;
    selectedPiece: StatesOfPiece;
    tile: Position;
  }>,
  currentTeam: TeamState,
  rookMoved: StatesOfPiece
) => {
  //disable castling if rooks are dead.
  const whiteKingSideRook = gameToUpdate.statesOfPieces.find(
    (piece) =>
      piece.position.x === 7 &&
      piece.position.y === 7 &&
      piece.type === Type.Rook &&
      piece.team === Team.White
  );
  //if its about to die, disable castling for it
  if (
    whiteKingSideRook &&
    action.payload.tile.x === whiteKingSideRook.position.x &&
    action.payload.tile.y === whiteKingSideRook.position.y
  ) {
    currentTeam.castlingStates.KingSide = true;
    currentTeam.castlingStates.KingRookMoved = true;
  }

  const whiteQueenSideRook = gameToUpdate.statesOfPieces.find(
    (piece) =>
      piece.position.x === 0 &&
      piece.position.y === 7 &&
      piece.type === Type.Rook &&
      piece.team === Team.White
  );
  //if its about to die, disable castling for it
  if (
    whiteQueenSideRook &&
    action.payload.tile.x === whiteQueenSideRook.position.x &&
    action.payload.tile.y === whiteQueenSideRook.position.y
  ) {
    currentTeam.castlingStates.KingSide = true;
    currentTeam.castlingStates.KingRookMoved = true;
  }

  const blackQueenSideRook = gameToUpdate.statesOfPieces.find(
    (piece) =>
      piece.position.x === 0 &&
      piece.position.y === 0 &&
      piece.type === Type.Rook &&
      piece.team === Team.Black
  );

  //if its about to die, disable castling for it
  if (
    blackQueenSideRook &&
    action.payload.tile.x === blackQueenSideRook.position.x &&
    action.payload.tile.y === blackQueenSideRook.position.y
  ) {
    currentTeam.castlingStates.QueenSide = true;
    currentTeam.castlingStates.QueenRookMoved = true;
  }
  //find black king side rook
  const blackKingSideRook = gameToUpdate.statesOfPieces.find(
    (piece) =>
      piece.position.x === 7 &&
      piece.position.y === 0 &&
      piece.type === Type.Rook &&
      piece.team === Team.Black
  );
  //if its about to die, disable castling for it
  if (
    blackKingSideRook &&
    action.payload.tile.x === blackKingSideRook.position.x &&
    action.payload.tile.y === blackKingSideRook.position.y
  ) {
    currentTeam.castlingStates.KingSide = true;
    currentTeam.castlingStates.KingRookMoved = true;
  }

  //detect white king side castling
  if (
    action.payload.selectedPiece.team === Team.White &&
    action.payload.selectedPiece.type === Type.King &&
    action.payload.tile.x === 6 &&
    action.payload.selectedPiece.position.x === 4
  ) {
    let kingSideRook = gameToUpdate.statesOfPieces.find(
      (piece) => piece.position.x === 7 && piece.position.y === 7
    );
    kingSideRook.position.x = 5;
    rookMoved = kingSideRook;
  }
  //detect white queen side castling
  if (
    action.payload.selectedPiece.team === Team.White &&
    action.payload.selectedPiece.type === Type.King &&
    action.payload.tile.x === 2 &&
    action.payload.selectedPiece.position.x === 4
  ) {
    let queenSideRook = gameToUpdate.statesOfPieces.find(
      (piece) => piece.position.x === 0 && piece.position.y === 7
    );
    queenSideRook.position.x = 3;
    rookMoved = queenSideRook;
  }

  //detect black king side castling
  if (
    action.payload.selectedPiece.team === Team.Black &&
    action.payload.selectedPiece.type === Type.King &&
    action.payload.tile.x === 6 &&
    action.payload.selectedPiece.position.x === 4
  ) {
    let kingSideRook = gameToUpdate.statesOfPieces.find(
      (piece) => piece.position.x === 7 && piece.position.y === 0
    );
    kingSideRook.position.x = 5;
    rookMoved = kingSideRook;
  }
  //detect black queen side castling
  if (
    action.payload.selectedPiece.team === Team.Black &&
    action.payload.selectedPiece.type === Type.King &&
    action.payload.tile.x === 2 &&
    action.payload.selectedPiece.position.x === 4
  ) {
    let queenSideRook = gameToUpdate.statesOfPieces.find(
      (piece) => piece.position.x === 0 && piece.position.y === 0
    );
    queenSideRook.position.x = 3;
    rookMoved = queenSideRook;
  }

  //If black king's first time moving, disable the ability to castle
  if (
    action.payload.selectedPiece.team === Team.Black &&
    action.payload.selectedPiece.type === Type.King &&
    action.payload.selectedPiece.position.x === 4 &&
    action.payload.selectedPiece.position.y === 0
  ) {
    let blackCastlingStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.Black
    ).castlingStates;
    blackCastlingStates.KingMoved = true;
    blackCastlingStates.KingSide = true;
    blackCastlingStates.QueenSide = true;
  } else if (
    //If white king's first time moving, disable the ability to castle
    action.payload.selectedPiece.team === Team.White &&
    action.payload.selectedPiece.type === Type.King &&
    action.payload.selectedPiece.position.x === 4 &&
    action.payload.selectedPiece.position.y === 7
  ) {
    let whiteCastlingStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.White
    ).castlingStates;
    whiteCastlingStates.KingMoved = true;
    whiteCastlingStates.KingSide = true;
    whiteCastlingStates.QueenSide = true;
  }

  return rookMoved;
};

export const handleEnpassant = (
  gameToUpdate: AllGameStates,
  selectedPiece: StatesOfPiece,
  action: PayloadAction<{
    currentGameId: string;
    selectedPiece: StatesOfPiece;
    tile: Position;
  }>
) => {
  //Check for enpassant pieces
  if (gameToUpdate.currentTeam === Team.Black) {
    //check for attacking pieces
    const enpassantStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.Black
    ).enpassantStates;
    if (
      selectedPiece.team === Team.Black &&
      selectedPiece.type === Type.Pawn &&
      action.payload.tile.y - 1 === 3
    ) {
      enpassantStates.alliedEnpassantPawns.push(selectedPiece);
    } else {
      enpassantStates.alliedEnpassantPawns =
        enpassantStates.alliedEnpassantPawns.filter(
          (pawn) => pawn.id !== selectedPiece.id
        );
    }

    //check for pieces to be captured
    const enemyEnpassantStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.White
    ).enpassantStates;
    //if current team's pawn moves forward 2 spaces, add it to teh enemy team's enpassantStates in enemyEnpassantPawns
    if (
      selectedPiece.team === Team.Black &&
      selectedPiece.type === Type.Pawn &&
      action.payload.tile.y - 1 === 2
    ) {
      enemyEnpassantStates.enemyEnpassantPawns.push(selectedPiece);
    }
  }
  if (gameToUpdate.currentTeam === Team.White) {
    const enpassantStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.White
    ).enpassantStates;
    if (
      selectedPiece.team === Team.White &&
      selectedPiece.type === Type.Pawn &&
      6 - action.payload.tile.y === 3
    ) {
      enpassantStates.alliedEnpassantPawns.push(selectedPiece);
    } else {
      enpassantStates.alliedEnpassantPawns =
        enpassantStates.alliedEnpassantPawns?.filter(
          (pawn) => pawn.id !== selectedPiece.id
        );
    }

    //check for pieces to be captured
    const enemyEnpassantStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.Black
    ).enpassantStates;
    //if current team's pawn moves forward 2 spaces, add it to teh enemy team's enpassantStates in enemyEnpassantPawns
    if (
      selectedPiece.team === Team.White &&
      selectedPiece.type === Type.Pawn &&
      6 - action.payload.tile.y === 2
    ) {
      enemyEnpassantStates.enemyEnpassantPawns.push(selectedPiece);
    }
  }

  //check for enpassant moves being performed
  //WHITE ENPASSANT
  if (
    selectedPiece.team === Team.White &&
    selectedPiece.type === Type.Pawn &&
    Math.abs(selectedPiece.position.x - action.payload.tile.x) === 1
  ) {
    //get pawn to be captured, and set it to alive = false
    const pawnToBeCaptured = gameToUpdate.statesOfPieces.find(
      (piece) =>
        piece.position.x === action.payload.tile.x &&
        piece.position.y === action.payload.tile.y + 1 &&
        piece.type === Type.Pawn &&
        piece.alive === true &&
        piece.team === Team.Black
    );
    if (pawnToBeCaptured) {
      pawnToBeCaptured.alive = false;
    }
  }
  //BLACK ENPASSANT
  if (
    selectedPiece.team === Team.Black &&
    selectedPiece.type === Type.Pawn &&
    Math.abs(selectedPiece.position.x - action.payload.tile.x) === 1
  ) {
    //get pawn to be captured, and set it to alive = false
    const pawnToBeCaptured = gameToUpdate.statesOfPieces.find(
      (piece) =>
        piece.position.x === action.payload.tile.x &&
        piece.position.y === action.payload.tile.y - 1 &&
        piece.type === Type.Pawn &&
        piece.alive === true &&
        piece.team === Team.White
    );
    if (pawnToBeCaptured) {
      pawnToBeCaptured.alive = false;
    }
  }
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
