import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AllGameStates,
  AllGamesStates,
  CurrentMoveState,
  MoveDetails,
  Position,
  StatesOfPiece,
} from "../../types/gameTypes";
import { CheckType, MoveDirection, Team, Type } from "../../types/enums";
import {
  calculateEnemyMoves,
  calculateValidMoves,
  calculateValidMovesCheckDetector,
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
      let currentMoveState = state.currentMovesState.find(
        (x) => x.gameId === action.payload.currentGameId
      );
      let copyOfGameState = JSON.parse(
        JSON.stringify(gameToUpdate)
      ) as AllGameStates;
      let copyOfCurrentmove = JSON.parse(
        JSON.stringify(currentMoveState)
      ) as CurrentMoveState;
      let copySelectedPiece = copyOfGameState.statesOfPieces?.find(
        (x) => x.id === action.payload.selectedPiece.id
      );

      if (selectedPiece && copySelectedPiece) {
        copySelectedPiece.position.x = action.payload.tile.x;
        copySelectedPiece.position.y = action.payload.tile.y;

        //check for discovered checks
        let originalPositionX = selectedPiece.position.x;
        let originalPositionY = selectedPiece.position.y;

        //get all enemy pieces that could check the king
        let enemyTeamPieces = copyOfGameState?.statesOfPieces?.filter(
          (piece) => piece.team !== selectedPiece.team
        );
        let tempArray: MoveDetails[] = [];
        //get ally king
        let allyKing = copyOfGameState?.statesOfPieces?.find(
          (piece) =>
            piece.type === Type.King && piece.team === selectedPiece.team
        );
        if (copyOfCurrentmove && copyOfGameState && enemyTeamPieces) {
          //get all valid moves
          for (let i = 0; i < enemyTeamPieces?.length; i++) {
            let moves = calculateValidMoves(
              enemyTeamPieces[i],
              copyOfGameState,
              copyOfCurrentmove.allEnemyMoves
            );
            Array.prototype.push.apply(tempArray, moves);
          }
        }
        let intersectingMove = tempArray.find(
          (move) =>
            move.x === allyKing?.position.x && move.y === allyKing.position.y
        );
        //if found, undo the move
        if (intersectingMove) {
          selectedPiece.position.x = originalPositionX;
          selectedPiece.position.y = originalPositionY;
          if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
          return;
        } else {
          selectedPiece.position.x = action.payload.tile.x;
          selectedPiece.position.y = action.payload.tile.y;
        }

        if (enemyPiece) {
          enemyPiece.alive = false;
        }

        let enemyKing = gameToUpdate?.statesOfPieces.find(
          (piece) =>
            piece.type === Type.King && piece.team !== selectedPiece.team
        );
        //recalculate all valid moves based on new move
        let currentTeamPieces = gameToUpdate?.statesOfPieces.filter(
          (piece) => piece.team === selectedPiece.team
        );
        if (currentMoveState?.validMoves) currentMoveState.validMoves = [];
        if (currentMoveState && gameToUpdate && currentTeamPieces) {
          let tempArray: MoveDetails[] = [];
          for (let i = 0; i < currentTeamPieces?.length; i++) {
            let moves = calculateValidMovesCheckDetector(
              currentTeamPieces[i],
              gameToUpdate,
              currentMoveState.allEnemyMoves
            );
            Array.prototype.push.apply(tempArray, moves);
          }
          currentMoveState.validMoves = tempArray;
        }
        //find the intersecting move
        intersectingMove = currentMoveState?.validMoves.find(
          (x) => x.x === enemyKing?.position.x && x.y === enemyKing.position.y
        );
        if (enemyKing && intersectingMove) {
          if (gameToUpdate) {
            gameToUpdate.checkStatus.type = CheckType.Check;
            gameToUpdate.checkStatus.teamInCheck = enemyKing.team;
            gameToUpdate.checkStatus.checkingPiece =
              intersectingMove.originPiece;
            gameToUpdate.checkStatus.attackPath =
              currentMoveState?.validMoves.filter(
                (move) =>
                  move.moveDirection === intersectingMove.moveDirection &&
                  intersectingMove.moveDirection !== MoveDirection.OneOff &&
                  move.originPiece === intersectingMove.originPiece
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
          currentMoveState.allEnemyMoves = [];
          currentMoveState.allEnemyMoves = calculateEnemyMoves(gameToUpdate);
        }
        //IMPLEMENT CHECKMATE CHECK
        //calculate all current team's moves
        currentTeamPieces = gameToUpdate?.statesOfPieces.filter(
          (piece) => piece.team === gameToUpdate.currentTeam
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
