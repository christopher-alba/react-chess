import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import {
  AllGameStates,
  AllGamesStates,
  Position,
  StatesOfPiece,
} from "../../types/gameTypes";
import { CheckType, Team, Type } from "../../types/enums";
import {
  calculateEnemyMoves,
  calculateValidMoves,
} from "../../helpers/moveHelper";
import {
  findPieceById,
  cloneGameState,
  cloneCurrentMoveState,
  checkForDiscoveredChecks,
  clearValidMoves,
  recalculateValidMovesAndCheck,
  calculateCheckmateState,
  switchTeamsAndReset,
} from "../../helpers/reduxHelper";

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState: {
    gamesStates: [],
    currentMovesState: [],
  } as AllGamesStates,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes.
    // Also, no return statement is required from these functions.
    createGameInstance: (state, action: PayloadAction<AllGameStates>) => {
      state.gamesStates.push(action.payload);
    },
    deleteGameInstance: (state, action: PayloadAction<AllGameStates>) => {
      state.gamesStates = state.gamesStates.filter(
        (x) => x.gameId !== action.payload.gameId
      );
    },
    makeMove: (
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
          clearValidMoves(currentMoveState);
          return;
        } else {
          const currentTeam = gameToUpdate.teamStates.find(
            (x) => x.teamName === gameToUpdate.currentTeam
          );

          //clear enemyEnpassantStates
          gameToUpdate.teamStates.forEach((team) => {
            team.enpassantStates.enemyEnpassantPawns = [];
          });

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
            selectedPiece.team === Team.White &&
            selectedPiece.type === Type.King &&
            action.payload.tile.x === 6 &&
            selectedPiece.position.x === 4
          ) {
            let kingSideRook = gameToUpdate.statesOfPieces.find(
              (piece) => piece.position.x === 7 && piece.position.y === 7
            );
            kingSideRook.position.x = 5;
            rookMoved = kingSideRook;
          }
          //detect white queen side castling
          if (
            selectedPiece.team === Team.White &&
            selectedPiece.type === Type.King &&
            action.payload.tile.x === 2 &&
            selectedPiece.position.x === 4
          ) {
            let queenSideRook = gameToUpdate.statesOfPieces.find(
              (piece) => piece.position.x === 0 && piece.position.y === 7
            );
            queenSideRook.position.x = 3;
            rookMoved = queenSideRook;
          }

          //detect black king side castling
          if (
            selectedPiece.team === Team.Black &&
            selectedPiece.type === Type.King &&
            action.payload.tile.x === 6 &&
            selectedPiece.position.x === 4
          ) {
            let kingSideRook = gameToUpdate.statesOfPieces.find(
              (piece) => piece.position.x === 7 && piece.position.y === 0
            );
            kingSideRook.position.x = 5;
            rookMoved = kingSideRook;
          }
          //detect black queen side castling
          if (
            selectedPiece.team === Team.Black &&
            selectedPiece.type === Type.King &&
            action.payload.tile.x === 2 &&
            selectedPiece.position.x === 4
          ) {
            let queenSideRook = gameToUpdate.statesOfPieces.find(
              (piece) => piece.position.x === 0 && piece.position.y === 0
            );
            queenSideRook.position.x = 3;
            rookMoved = queenSideRook;
          }

          //If black king's first time moving, disable the ability to castle
          if (
            selectedPiece.team === Team.Black &&
            selectedPiece.type === Type.King &&
            selectedPiece.position.x === 4 &&
            selectedPiece.position.y === 0
          ) {
            let blackCastlingStates = gameToUpdate.teamStates.find(
              (team) => team.teamName === Team.Black
            ).castlingStates;
            blackCastlingStates.KingMoved = true;
            blackCastlingStates.KingSide = true;
            blackCastlingStates.QueenSide = true;
          } else if (
            //If white king's first time moving, disable the ability to castle
            selectedPiece.team === Team.White &&
            selectedPiece.type === Type.King &&
            selectedPiece.position.x === 4 &&
            selectedPiece.position.y === 7
          ) {
            let whiteCastlingStates = gameToUpdate.teamStates.find(
              (team) => team.teamName === Team.White
            ).castlingStates;
            whiteCastlingStates.KingMoved = true;
            whiteCastlingStates.KingSide = true;
            whiteCastlingStates.QueenSide = true;
          }
        }

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
              piece.position.y === action.payload.tile.y + 1
          );
          pawnToBeCaptured.alive = false;
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
              piece.position.y === action.payload.tile.y - 1
          );
          pawnToBeCaptured.alive = false;
        }

        // Update selected piece position
        selectedPiece.position.x = action.payload.tile.x;
        selectedPiece.position.y = action.payload.tile.y;

        // Capture enemy piece if exists
        if (enemyPieces?.length > 0)
          enemyPieces.forEach((x) => {
            if (x.alive) x.alive = false;
          });

        // Recalculate valid moves and check for check
        if (rookMoved) {
          recalculateValidMovesAndCheck(
            gameToUpdate,
            currentMoveState,
            rookMoved
          );
        } else {
          recalculateValidMovesAndCheck(
            gameToUpdate,
            currentMoveState,
            selectedPiece
          );
        }

        //reset checking states
        switchTeamsAndReset(gameToUpdate, currentMoveState);

        // Update game state and current move state
        calculateCheckmateState(gameToUpdate, currentMoveState);
      }
    },
    selectPiece: (
      state,
      action: PayloadAction<{ gameId: string; id: string }>
    ) => {
      let currentGame = state.gamesStates.find(
        (x) => x.gameId === action.payload.gameId
      );
      if (currentGame?.checkStatus.type === CheckType.Checkmate) return;
      let matchingPiece = currentGame?.statesOfPieces.find(
        (x) => x.id === action.payload.id
      );
      console.log(JSON.stringify(currentGame));
      let currentMoveState = state.currentMovesState.find(
        (x) => x.gameId === action.payload.gameId
      );

      if (matchingPiece && matchingPiece?.team === currentGame?.currentTeam) {
        if (!currentMoveState) {
          state.currentMovesState.push({
            gameId: action.payload.gameId,
            selectedPieceId: action.payload.id,
            validMoves: calculateValidMoves(matchingPiece, currentGame, []),
            selectedMoveLocation: undefined,
            allEnemyMoves: calculateEnemyMoves(currentGame),
          });
        } else {
          currentMoveState.gameId = currentGame?.gameId;
          currentMoveState.selectedPieceId = action.payload.id;
          currentMoveState.allEnemyMoves = calculateEnemyMoves(currentGame);
          currentMoveState.validMoves = calculateValidMoves(
            matchingPiece,
            currentGame,
            currentMoveState.allEnemyMoves
          );
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { createGameInstance, makeMove, selectPiece } =
  gameStateSlice.actions;

export default gameStateSlice.reducer;
