import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AllGameStates,
  AllGamesStates,
  MoveDetails,
  MoveDetailsForHistory,
  Position,
  StatesOfPiece,
} from "../../types/gameTypes";
import {
  CheckType,
  GameState,
  MoveConsequence,
  Team,
  Type,
} from "../../types/enums";
import {
  calculateEnemyMoves,
  calculateValidMoves,
} from "../../helpers/moveHelper";
import {
  recalculateValidMovesAndCheck,
  calculateCheckmateState,
  makeSingleMove,
} from "../../helpers/reduxHelper";
import { mapCoordinatesToChessNotation } from "../../helpers/general";
import { socket } from "../../socket";

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
    updateGameInstance: (state, action: PayloadAction<AllGamesStates>) => {
      state.currentMovesState = action.payload.currentMovesState;
      state.gamesStates = action.payload.gamesStates;
      console.log(state);
    },
    updateGameId: (state, action: PayloadAction<string>) => {
      state.gamesStates[0].gameId = action.payload;
    },
    promotePawn: (
      state: AllGamesStates,
      action: PayloadAction<{
        currentGameId: string;
        pawnToPromote: StatesOfPiece;
        targetPieceType: Type;
      }>
    ) => {
      const currentGame = state.gamesStates.find(
        (x) => x.gameId === action.payload.currentGameId
      );
      const currentMoveState = state.currentMovesState.find(
        (x) => x.gameId === action.payload.currentGameId
      );
      const pawnToPromote = currentGame.statesOfPieces.find(
        (x) => x.id === action.payload.pawnToPromote.id
      );
      pawnToPromote.type = action.payload.targetPieceType;

      let checkType = recalculateValidMovesAndCheck(
        currentGame,
        currentMoveState,
        pawnToPromote
      );

      if (currentGame.currentTeam === Team.WhitePromotion) {
        currentGame.currentTeam = Team.Black;
      } else if (currentGame.currentTeam === Team.BlackPromotion) {
        currentGame.currentTeam = Team.White;
      }
      currentMoveState.selectedPieceId = undefined;

      let finalConsequence: MoveConsequence = undefined;

      //check for checkmate
      let cmState = calculateCheckmateState(currentGame, currentMoveState);

      if (cmState === GameState.WinnerDecided) {
        finalConsequence = MoveConsequence.PromotionAndCheckmate;
      } else if (cmState === GameState.Draw) {
        finalConsequence = MoveConsequence.PromotionAndDraw;
      } else if (checkType === CheckType.Check) {
        finalConsequence = MoveConsequence.PromotionAndCheck;
      } else {
        finalConsequence = MoveConsequence.Promotion;
      }

      currentGame.moveHistory.push({
        x: pawnToPromote.position.x,
        y: pawnToPromote.position.y,
        moveConsequence: finalConsequence,
        originPiece: pawnToPromote,
        team: pawnToPromote.team,
        chessNotationPosition: mapCoordinatesToChessNotation(
          pawnToPromote.position.x,
          pawnToPromote.position.y
        ),
        chessNotationOriginPosition: mapCoordinatesToChessNotation(
          pawnToPromote.position.x,
          pawnToPromote.position.y
        ),
        capturedPiece: undefined,
        chessNotationPositionCaptured: undefined,
      } as MoveDetailsForHistory);
    },
    makeMove: (
      state: AllGamesStates,
      action: PayloadAction<{
        currentGameId: string;
        selectedPiece: StatesOfPiece;
        tile: Position;
      }>
    ) => {
      makeSingleMove(state, action);
      socket.emit(
        "move",
        { allGamesStates: state, gameID: state.gamesStates[0].gameId } as {
          allGamesStates: AllGamesStates;
          gameID: string;
        },
        ({ color }) => {
          console.log({ color });
        }
      );
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
      if (matchingPiece.team !== currentGame.currentTeam) return;

      let currentMoveState = state.currentMovesState.find(
        (x) => x.gameId === action.payload.gameId
      );
      if (currentMoveState) {
        currentMoveState.gameId = currentGame?.gameId;
        currentMoveState.selectedPieceId = action.payload.id;
        currentMoveState.allEnemyMoves = calculateEnemyMoves(currentGame);
        currentMoveState.validMoves = [];
      }
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
          const uncheckedValidMoves = calculateValidMoves(
            matchingPiece,
            currentGame,
            currentMoveState.allEnemyMoves
          );
          let actualValidMoves: MoveDetails[] = [];
          for (let i = 0; i < uncheckedValidMoves.length; i++) {
            if (
              makeSingleMove(state, {
                payload: {
                  currentGameId: currentGame.gameId,
                  selectedPiece: matchingPiece,
                  tile: {
                    x: uncheckedValidMoves[i].x,
                    y: uncheckedValidMoves[i].y,
                  },
                },
                type: "VALIDATION",
              })
            ) {
              actualValidMoves.push(uncheckedValidMoves[i]);
            }
          }
          currentMoveState.validMoves = actualValidMoves;
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  createGameInstance,
  makeMove,
  selectPiece,
  promotePawn,
  updateGameInstance,
  updateGameId,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
