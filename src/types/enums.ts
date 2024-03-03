export enum Type {
  Pawn = "PAWN",
  King = "KING",
  Queen = "QUEEN",
  Rook = "ROOK",
  Knight = "KNIGHT",
  Bishop = "BISHOP",
}

export enum Team {
  Black = "BLACK",
  White = "WHITE",
  Left = "LEFT",
  Right = "RIGHT",
  None = "NONE",
}

export enum Mode {
  TwoPlayer,
  FourPlayer,
}

export enum GameState {
  Ongoing,
  Draw,
  WinnerDecided,
  Stopped,
}

export enum TileColor {
  Light,
  Dark,
}

export enum CheckType {
  None,
  Check,
  Checkmate,
}

export enum MoveType {
  AttackPath,
  CheckPath,
  DefaultMove,
}

export enum MoveDirection {
  Up,
  Down,
  Left,
  Right,
  UpperLeft,
  UpperRight,
  BottomLeft,
  BottomRight,
  OneOff,
}

export enum ValidationType {
  CheckDetector,
  Default,
  Enemy,
}
