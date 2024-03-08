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
  originPiece: StatesOfPiece;
};

export type Tile = {
  position: Position;
  isWall: boolean;
  color: TileColor;
};
export type Tiles = Tile[];
export type CastlingStates = {
  KingMoved: boolean;
  KingRookMoved: boolean;
  QueenRookMoved: boolean;
  KingSide: boolean;
  QueenSide: boolean;
};
export type TeamState = {
  teamName: Team;
  alive: boolean;
  winner: boolean;
  castlingStates: CastlingStates;
  enpassantStates: EnpassantStates;
};

export type EnpassantStates = {
  alliedEnpassantPawns: StatesOfPieces;
  enemyEnpassantPawns: StatesOfPieces;
};

export type TeamStates = TeamState[];
export type StatesOfPiece = {
  position: Position;
  alive: boolean;
  team: Team;
  id: string;
  type: Type;
  timeCapturedTimestamp?: number;
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
  checkStatus: CheckStatus;
};

export type CheckStatus = {
  type: CheckType;
  teamInCheck: Team;
  checkingPieces?: StatesOfPieces;
  attackPath?: MoveDetails[];
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

export type DirectionData = {
  dx: number;
  dy: number;
  direction: MoveDirection;
};

export type DirectionAndOrigin = {
  direction: MoveDirection;
  originPiece: StatesOfPiece;
};
