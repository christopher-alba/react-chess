import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AllGameStates,
  AllGamesStates,
  MoveDetailsForHistory,
  Position,
  StatesOfPiece,
} from "../../types/gameTypes";
import { CheckType, GameState, MoveConsequence } from "../../types/enums";
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
  handleCastling,
  handleEnpassant,
} from "../../helpers/reduxHelper";
import { mapCoordinatesToChessNotation } from "../../helpers/general";

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

          rookMoved = handleCastling(
            gameToUpdate,
            action,
            currentTeam,
            rookMoved
          );
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
        let originPiece: StatesOfPiece = JSON.parse(
          JSON.stringify(selectedPiece)
        );
        //reset checking states
        switchTeamsAndReset(gameToUpdate, currentMoveState);

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
