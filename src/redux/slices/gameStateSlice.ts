import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AllGameStates,
  AllGamesStates,
  Position,
  StatesOfPiece,
} from "../../types/gameTypes";
import { CheckType } from "../../types/enums";
import {
  calculateEnemyMoves,
  calculateValidMoves,
} from "../../helpers/moveHelper";
import {
  findPieceById,
  findEnemyPiece,
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
      const enemyPiece = findEnemyPiece(
        gameToUpdate,
        selectedPiece,
        action.payload.tile
      );

      // Make copies of game state and current move state
      const copyOfGameState = cloneGameState(gameToUpdate);
      const copyOfCurrentMove = cloneCurrentMoveState(currentMoveState);

      if (selectedPiece && copyOfGameState && copyOfCurrentMove) {
        let copyOfSelectedPiece = copyOfGameState.statesOfPieces.find(
          (piece) => piece.id === selectedPiece.id
        );
        // Check for discovered checks
        const originalPosition = {
          x: copyOfSelectedPiece.position.x,
          y: copyOfSelectedPiece.position.y,
        };
        if (
          checkForDiscoveredChecks(
            gameToUpdate,
            currentMoveState,
            selectedPiece,
            action.payload.tile
          )
        ) {
          // Undo the move if discovered check
          selectedPiece.position = originalPosition;
          clearValidMoves(currentMoveState);
          return;
        } else {
          // Update selected piece position
          selectedPiece.position.x = action.payload.tile.x;
          selectedPiece.position.y = action.payload.tile.y;
        }

        // Capture enemy piece if exists
        if (enemyPiece) enemyPiece.alive = false;

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
