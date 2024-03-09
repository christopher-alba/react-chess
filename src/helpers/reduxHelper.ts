import { PayloadAction } from "@reduxjs/toolkit";
import {
  Team,
  Type,
  CheckType,
  MoveDirection,
  GameState,
  MoveConsequence,
} from "../types/enums";
import {
  AllGameStates,
  AllGamesStates,
  CurrentMoveState,
  MoveDetails,
  MoveDetailsForHistory,
  Position,
  StatesOfPiece,
  TeamState,
} from "../types/gameTypes";
import {
  calculateEnemyMoves,
  calculateValidMoves,
  calculateValidMovesCheckDetector,
} from "./moveHelper";
import { mapCoordinatesToChessNotation } from "./general";

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

export const makeSingleMove = (
  state: AllGamesStates,
  action: PayloadAction<{
    currentGameId: string;
    selectedPiece: StatesOfPiece;
    tile: Position;
  }>
) => {
  // Find selected piece and enemy piece
  const gameToUpdate = state.gamesStates.find(
    (x) => x.gameId === action.payload.currentGameId
  );
  const currentMoveState = state.currentMovesState.find(
    (x) => x.gameId === action.payload.currentGameId
  );
  const selectedPiece = findPieceById(
    gameToUpdate,
    action.payload.selectedPiece.id
  );
  const enemyPieces = gameToUpdate?.statesOfPieces.filter(
    (piece) =>
      piece.team !== selectedPiece?.team &&
      piece.position.x === action.payload.tile.x &&
      piece.position.y === action.payload.tile.y &&
      piece.alive === true
  );

  // Make copies of game state and current move state
  const copyOfGameState = cloneGameState(gameToUpdate);
  const copyOfCurrentMove = cloneCurrentMoveState(currentMoveState);
  const copyOfSelectedPieceId = copyOfCurrentMove.selectedPieceId;
  let copyOfSelectedPiece = copyOfGameState.statesOfPieces.find(
    (x) => x.id === copyOfSelectedPieceId
  );
  if (selectedPiece && copyOfGameState && copyOfCurrentMove) {
    copyOfSelectedPiece.position.x = action.payload.tile.x;
    copyOfSelectedPiece.position.y = action.payload.tile.y;

    // Check for discovered checks
    let rookMoved: StatesOfPiece = undefined;
    if (
      checkForDiscoveredChecks(
        copyOfGameState,
        copyOfCurrentMove,
        selectedPiece,
        action.payload.tile
      )
    ) {
      if (action.type === "VALIDATION") {
        return false;
      } else {
        clearValidMoves(currentMoveState);
        return false;
      }
    } else {
      const currentTeam = gameToUpdate.teamStates.find(
        (x) => x.teamName === gameToUpdate.currentTeam
      );

      //clear enemyEnpassantStates
      gameToUpdate.teamStates.forEach((team) => {
        team.enpassantStates.enemyEnpassantPawns = [];
      });
      if (action.type === "VALIDATION") {
        return true;
      } else {
        rookMoved = handleCastling(
          gameToUpdate,
          action,
          currentTeam,
          rookMoved
        );
      }
    }

    handleEnpassant(gameToUpdate, selectedPiece, action);

    // Update selected piece position
    const copyOfOriginPosition: Position = JSON.parse(
      JSON.stringify(selectedPiece.position)
    );
    selectedPiece.position.x = action.payload.tile.x;
    selectedPiece.position.y = action.payload.tile.y;
    selectedPiece.chessNotationPosition = mapCoordinatesToChessNotation(
      action.payload.tile.x,
      action.payload.tile.y
    );

    let enemyCaptured = false;
    // Capture enemy piece if exists
    if (enemyPieces?.length > 0)
      enemyPieces.forEach((x) => {
        if (x.alive) {
          x.alive = false;
          x.timeCapturedTimestamp = Date.now();
          enemyCaptured = true;
        }
      });
    let checkType;
    // Recalculate valid moves and check for check
    if (rookMoved) {
      checkType = recalculateValidMovesAndCheck(
        gameToUpdate,
        currentMoveState,
        rookMoved
      );
    } else {
      checkType = recalculateValidMovesAndCheck(
        gameToUpdate,
        currentMoveState,
        selectedPiece
      );
    }
    let originPiece: StatesOfPiece = JSON.parse(JSON.stringify(selectedPiece));
    //reset checking states
    gameToUpdate.promotionPiece = selectedPiece;
    currentMoveState.allEnemyMoves = [];
    currentMoveState.validMoves = [];
    if (
      selectedPiece.position.y === 0 &&
      selectedPiece.team === Team.White &&
      selectedPiece.type === Type.Pawn
    ) {
      gameToUpdate.currentTeam = Team.WhitePromotion;
    } else if (
      selectedPiece.position.y === 7 &&
      selectedPiece.team === Team.Black &&
      selectedPiece.type === Type.Pawn
    ) {
      gameToUpdate.currentTeam = Team.BlackPromotion;
    } else {
      switchTeamsAndReset(gameToUpdate, currentMoveState);
    }

    // Update game state and current move state
    let cmState = calculateCheckmateState(gameToUpdate, currentMoveState);
    let finalConsequence: MoveConsequence = undefined;
    let finalCaptured: StatesOfPiece = undefined;
    let finalCapturedChessPos: string = undefined;

    if (enemyCaptured) {
      finalCaptured = enemyPieces[0];
      finalCapturedChessPos = enemyPieces[0].chessNotationPosition;
    }

    if (cmState === GameState.WinnerDecided) {
      if (enemyCaptured) {
        finalConsequence = MoveConsequence.CaptureAndCheckmate;
      } else {
        finalConsequence = MoveConsequence.Checkmate;
      }
    } else if (cmState === GameState.Draw) {
      if (enemyCaptured) {
        finalConsequence = MoveConsequence.CaptureAndDraw;
      } else {
        finalConsequence = MoveConsequence.Draw;
      }
    } else if (checkType === CheckType.Check) {
      if (enemyCaptured) {
        finalConsequence = MoveConsequence.CaptureAndCheck;
      } else {
        finalConsequence = MoveConsequence.Check;
      }
    } else if (enemyCaptured) {
      finalConsequence = MoveConsequence.Capture;
    } else {
      finalConsequence = MoveConsequence.Default;
    }

    gameToUpdate.moveHistory.push({
      x: action.payload.tile.x,
      y: action.payload.tile.y,
      moveConsequence: finalConsequence,
      originPiece: originPiece,
      team: originPiece.team,
      chessNotationPosition: mapCoordinatesToChessNotation(
        action.payload.tile.x,
        action.payload.tile.y
      ),
      chessNotationOriginPosition: mapCoordinatesToChessNotation(
        copyOfOriginPosition.x,
        copyOfOriginPosition.y
      ),
      capturedPiece: finalCaptured,
      chessNotationPositionCaptured: finalCapturedChessPos,
    } as MoveDetailsForHistory);
  }
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
    kingSideRook.chessNotationPosition = mapCoordinatesToChessNotation(5, 7);
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
    queenSideRook.chessNotationPosition = mapCoordinatesToChessNotation(3, 7);
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
    kingSideRook.chessNotationPosition = mapCoordinatesToChessNotation(5, 0);
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
    queenSideRook.chessNotationPosition = mapCoordinatesToChessNotation(3, 0);
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

  //if white kingside rook first time moving, disable the ability to kingside castle
  if (
    action.payload.selectedPiece.team === Team.White &&
    action.payload.selectedPiece.type === Type.Rook &&
    action.payload.selectedPiece.position.x === 0 &&
    action.payload.selectedPiece.position.y === 7
  ) {
    let whiteCastlingStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.White
    ).castlingStates;
    whiteCastlingStates.KingSide = true;
    whiteCastlingStates.KingRookMoved = true;
  }

  //if white queenside rook first time moving, disable the ability to queenside castle
  if (
    action.payload.selectedPiece.team === Team.White &&
    action.payload.selectedPiece.type === Type.Rook &&
    action.payload.selectedPiece.position.x === 7 &&
    action.payload.selectedPiece.position.y === 7
  ) {
    let whiteCastlingStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.White
    ).castlingStates;
    whiteCastlingStates.QueenSide = true;
    whiteCastlingStates.QueenRookMoved = true;
  }

  //if black kingside rook first time moving, disable the ability to kingside castle
  if (
    action.payload.selectedPiece.team === Team.Black &&
    action.payload.selectedPiece.type === Type.Rook &&
    action.payload.selectedPiece.position.x === 0 &&
    action.payload.selectedPiece.position.y === 0
  ) {
    let blackCastlingStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.Black
    ).castlingStates;
    blackCastlingStates.KingSide = true;
    blackCastlingStates.KingRookMoved = true;
  }

  //if black queenside rook first time moving, disable the ability to queenside castle
  if (
    action.payload.selectedPiece.team === Team.Black &&
    action.payload.selectedPiece.type === Type.Rook &&
    action.payload.selectedPiece.position.x === 7 &&
    action.payload.selectedPiece.position.y === 0
  ) {
    let blackCastlingStates = gameToUpdate.teamStates.find(
      (team) => team.teamName === Team.Black
    ).castlingStates;
    blackCastlingStates.QueenSide = true;
    blackCastlingStates.QueenRookMoved = true;
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
      pawnToBeCaptured.timeCapturedTimestamp = Date.now();
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
      pawnToBeCaptured.timeCapturedTimestamp = Date.now();
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
  let checkingPieces = gameState.checkStatus.checkingPieces;
  //if checkingPiece is about to be killed by the move, set it to alive = false and remove the attack path
  for (let i = 0; i < checkingPieces?.length; i++) {
    if (
      checkingPieces &&
      checkingPieces[i].position.x === tile.x &&
      checkingPieces[i].position.y === tile.y
    ) {
      gameState.statesOfPieces.find(
        (piece) => piece.id === checkingPieces[i].id
      ).alive = false;
      gameState.statesOfPieces.find(
        (piece) => piece.id === checkingPieces[i].id
      ).timeCapturedTimestamp = Date.now();
      gameState.checkStatus.attackPath = [];
      checkingPieces = undefined;
    }
  }
  //if any enemy piece is about to be killed, make it alive = false and remove its attack path
  let enemyAboutToGetRekt = enemyTeamPieces.find(
    (piece) => piece.position.x === tile.x && piece.position.y === tile.y
  );
  if (enemyAboutToGetRekt) {
    enemyAboutToGetRekt.alive = false;
    enemyAboutToGetRekt.timeCapturedTimestamp = Date.now();
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
  gameState: AllGameStates,
  currentMoveState: CurrentMoveState,
  selectedPiece: StatesOfPiece
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
  let intersectingMoves = currentMoveState?.validMoves.filter(
    (x) => x.x === enemyKing?.position.x && x.y === enemyKing.position.y
  );
  if (enemyKing && intersectingMoves.length > 0) {
    if (gameState) {
      gameState.checkStatus.type = CheckType.Check;
      gameState.checkStatus.teamInCheck = enemyKing.team;
      gameState.checkStatus.checkingPieces = intersectingMoves.map(
        (move) => move.originPiece
      );
      let attackPath = [];
      gameState.checkStatus.attackPath = [];
      for (let i = 0; i < intersectingMoves.length; i++) {
        let temp = currentMoveState?.validMoves.filter(
          (move) =>
            move.moveDirection === intersectingMoves[i].moveDirection &&
            intersectingMoves[i].moveDirection !== MoveDirection.OneOff &&
            move.originPiece === intersectingMoves[i].originPiece
        );
        attackPath = attackPath.concat(temp);
      }
      gameState.checkStatus.attackPath = attackPath;
      return CheckType.Check;
    }
  } else {
    if (gameState) {
      gameState.checkStatus.type = CheckType.None;
      gameState.checkStatus.teamInCheck = Team.None;
      gameState.checkStatus.checkingPieces = undefined;
      gameState.checkStatus.attackPath = [];
      return CheckType.None;
    }
  }
};

export const calculateCheckmateState = (
  gameToUpdate: AllGameStates,
  currentMoveState: CurrentMoveState
) => {
  if (
    gameToUpdate.currentTeam === Team.BlackPromotion ||
    gameToUpdate.currentTeam === Team.WhitePromotion
  ) {
    return GameState.Ongoing;
  }
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
      if (gameToUpdate.checkStatus.checkingPieces === undefined) {
        gameToUpdate.checkStatus.type = CheckType.None;
        gameToUpdate.gameState = GameState.Draw;
        return GameState.Draw;
      } else {
        gameToUpdate.checkStatus.type = CheckType.Checkmate;
        gameToUpdate.gameState = GameState.WinnerDecided;
        return GameState.WinnerDecided;
      }
    }
  } else {
    if (currentMoveState?.validMoves) {
      currentMoveState.validMoves = [];
      return GameState.Ongoing;
    }
  }
};

export const clearValidMoves = (currentMoveState) => {
  if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
};
