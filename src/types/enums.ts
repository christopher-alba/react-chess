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
