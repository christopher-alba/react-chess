import * as jose from "jose";

export const mapCoordinatesToChessNotation = (x: number, y: number): string => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const file = letters[x];
  const rank = (8 - y).toString();
  return `${file}${rank}`;
};

export function parseJwt(token: string) {
  return jose.decodeJwt(token);
}
