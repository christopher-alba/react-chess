import { PayloadAction, createSlice } from "@reduxjs/toolkit";
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
            action.payload.tile.x === whiteKingSideRook.position.x &&
            action.payload.tile.y === whiteKingSideRook.position.y
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

          if (
            selectedPiece.team === Team.White &&
            selectedPiece.type === Type.King &&
            action.payload.tile.x === 6 &&
            selectedPiece.position.x === 4
          ) {
            //detect white king side castling
            let kingSideRook = gameToUpdate.statesOfPieces.find(
              (piece) => piece.position.x === 7 && piece.position.y === 7
            );
            kingSideRook.position.x = 5;
          }
          //detect white queen side castling
          if (
            selectedPiece.team === Team.White &&
            selectedPiece.type === Type.King &&
            action.payload.tile.x === 2 &&
            selectedPiece.position.x === 4
          ) {
            let kingSideRook = gameToUpdate.statesOfPieces.find(
              (piece) => piece.position.x === 0 && piece.position.y === 7
            );
            kingSideRook.position.x = 3;
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
          }
          //detect black queen side castling
          if (
            selectedPiece.team === Team.Black &&
            selectedPiece.type === Type.King &&
            action.payload.tile.x === 2 &&
            selectedPiece.position.x === 4
          ) {
            let kingSideRook = gameToUpdate.statesOfPieces.find(
              (piece) => piece.position.x === 0 && piece.position.y === 0
            );
            kingSideRook.position.x = 3;
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

        // Update selected piece position
        selectedPiece.position.x = action.payload.tile.x;
        selectedPiece.position.y = action.payload.tile.y;

        // Capture enemy piece if exists
        if (enemyPieces?.length > 0)
          enemyPieces.forEach((x) => {
            if (x.alive) x.alive = false;
          });

        // Recalculate valid moves and check for check
        recalculateValidMovesAndCheck(
          gameToUpdate,
          currentMoveState,
          selectedPiece
        );
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
