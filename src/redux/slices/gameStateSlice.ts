import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AllGameStates,
  AllGamesStates,
  CurrentMoveState,
  Position,
  StatesOfPiece,
  Tile,
} from "../../types/gameTypes";
import { Team } from "../../types/enums";
import { calculateValidMoves, isValidMove } from "../../helpers/moveHelper";

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
    updateGameInstance: (state, action: PayloadAction<AllGameStates>) => {
      let boardToUpdate = state.gamesStates.find(
        (x) => x.gameId === action.payload.gameId
      );
      boardToUpdate = action.payload;
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
      let gameToUpdate = state.gamesStates.find(
        (x) => x.gameId === action.payload.currentGameId
      );
      let selectedPiece = gameToUpdate?.statesOfPieces.find(
        (x) => x.id === action.payload.selectedPiece.id
      );
      if (selectedPiece) {
        selectedPiece.position.x = action.payload.tile.x;
        selectedPiece.position.y = action.payload.tile.y;
        if (gameToUpdate?.currentTeam) {
          gameToUpdate.currentTeam =
            gameToUpdate.currentTeam === Team.Black ? Team.White : Team.Black;
        }
        let currentMoveState = state.currentMovesState.find(
          (x) => x.gameId === action.payload.currentGameId
        );
        if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
        if (currentMoveState?.selectedPieceId)
          currentMoveState.selectedPieceId = undefined;
      }
      console.log(state);
    },
    selectPiece: (
      state,
      action: PayloadAction<{ gameId: string; id: string }>
    ) => {
      let currentGame = state.gamesStates.find(
        (x) => x.gameId === action.payload.gameId
      );
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
            validMoves: calculateValidMoves(matchingPiece, currentGame),
            selectedMoveLocation: undefined,
          });
        } else {
          currentMoveState.gameId = currentGame?.gameId;
          currentMoveState.selectedPieceId = action.payload.id;
          currentMoveState.validMoves = calculateValidMoves(
            matchingPiece,
            currentGame
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
