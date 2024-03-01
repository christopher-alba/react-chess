import {
  CheckType,
  GameState,
  Mode,
  MoveDirection,
  MoveType,
  Team,
  TileColor,
  Type,
} from "./enums";

export type Position = {
  x: number;
  y: number;
};

export type MoveDetails = {
  x: number;
  y: number;
  moveType: MoveType;
  moveDirection: MoveDirection;
};

export type Tile = {
  position: Position;
  isWall: boolean;
  color: TileColor;
};
export type Tiles = Tile[];
export type TeamState = {
  teamName: Team;
  alive: boolean;
  winner: boolean;
};
export type TeamStates = TeamState[];
export type StatesOfPiece = {
  position: Position;
  alive: boolean;
  team: Team;
  id: string;
  type: Type;
};
export type StatesOfPieces = StatesOfPiece[];

export type AllGameStates = {
  gameId: string;
  mode: Mode;
  currentTeam: Team;
  teamStates: TeamStates;
  gameState: GameState;
  availableTiles: Tiles;
  statesOfPieces: StatesOfPieces;
  checkStatus: {
    type: CheckType;
    teamInCheck: Team;
    checkingPiece?: StatesOfPiece;
    attackPath?: MoveDetails[];
  };
};
export type AllGamesStates = {
  gamesStates: AllGameStates[];
  currentMovesState: CurrentMoveState[];
};

export type CurrentMoveState = {
  selectedPieceId?: string;
  gameId?: string;
  validMoves: MoveDetails[] | [];
  allEnemyMoves: MoveDetails[] | [];
  selectedMoveLocation?: Position;
};
