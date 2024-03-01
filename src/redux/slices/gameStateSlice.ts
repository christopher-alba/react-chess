import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AllGameStates,
  AllGamesStates,
  CurrentMoveState,
  MoveDetails,
  Position,
  StatesOfPiece,
  Tile,
} from "../../types/gameTypes";
import {
  CheckType,
  GameState,
  MoveDirection,
  Team,
  Type,
} from "../../types/enums";
import {
  calculateEnemyMoves,
  calculateKingMoves,
  calculateValidMoves,
  calculateValidMovesCheckDetector,
  isValidMove,
} from "../../helpers/moveHelper";

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

      let enemyPiece = gameToUpdate?.statesOfPieces.find(
        (x) =>
          x.team !== selectedPiece?.team &&
          x.position.x === action.payload.tile.x &&
          x.position.y === action.payload.tile.y
      );
      if (selectedPiece) {
        if (enemyPiece) {
          enemyPiece.alive = false;
        }

        selectedPiece.position.x = action.payload.tile.x;
        selectedPiece.position.y = action.payload.tile.y;

        let currentMoveState = state.currentMovesState.find(
          (x) => x.gameId === action.payload.currentGameId
        );
        let enemyKing = gameToUpdate?.statesOfPieces.find(
          (piece) =>
            piece.type === Type.King && piece.team !== selectedPiece.team
        );
        //recalculate all valid moves based on new move
        let currentTeamPieces = gameToUpdate?.statesOfPieces.filter(
          (piece) => piece.team === selectedPiece.team
        );

        if (currentMoveState && gameToUpdate && currentTeamPieces) {
          let tempArray: MoveDetails[] = [];
          for (let i = 0; i < currentTeamPieces?.length; i++) {
            Array.prototype.push.apply(
              tempArray,
              calculateValidMovesCheckDetector(
                currentTeamPieces[i],
                gameToUpdate,
                currentMoveState.allEnemyMoves
              )
            );
          }
          currentMoveState.validMoves = tempArray;
        }
        let intersectingMove = currentMoveState?.validMoves.find(
          (x) => x.x === enemyKing?.position.x && x.y === enemyKing.position.y
        );
        if (enemyKing && intersectingMove) {
          if (gameToUpdate) {
            gameToUpdate.checkStatus.type = CheckType.Check;
            gameToUpdate.checkStatus.teamInCheck = enemyKing.team;
            gameToUpdate.checkStatus.checkingPiece = intersectingMove.originPiece;
            gameToUpdate.checkStatus.attackPath =
              currentMoveState?.validMoves.filter(
                (move) =>
                  move.moveDirection === intersectingMove.moveDirection &&
                  intersectingMove.moveDirection !== MoveDirection.OneOff
              );
          }
        } else {
          if (gameToUpdate) {
            gameToUpdate.checkStatus.type = CheckType.None;
            gameToUpdate.checkStatus.teamInCheck = Team.None;
            gameToUpdate.checkStatus.checkingPiece = undefined;
            gameToUpdate.checkStatus.attackPath = [];
          }
        }

        if (gameToUpdate?.currentTeam) {
          gameToUpdate.currentTeam =
            gameToUpdate.currentTeam === Team.Black ? Team.White : Team.Black;
        }
        if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
        if (currentMoveState?.selectedPieceId) {
          currentMoveState.selectedPieceId = undefined;
        }
        if (currentMoveState?.allEnemyMoves && gameToUpdate) {
          currentMoveState.allEnemyMoves = calculateEnemyMoves(gameToUpdate);
        }
        if (
          enemyKing &&
          gameToUpdate &&
          currentMoveState &&
          gameToUpdate.checkStatus.type === CheckType.Check
        ) {
          if (
            !calculateKingMoves(
              enemyKing,
              gameToUpdate,
              currentMoveState.allEnemyMoves
            )
          ) {
            gameToUpdate.checkStatus.type = CheckType.Checkmate;
            gameToUpdate.checkStatus.teamInCheck = enemyKing.team;
            gameToUpdate.gameState = GameState.WinnerDecided;
          }
        }
      }
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
