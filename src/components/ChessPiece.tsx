import { FC } from "react";
import { Position } from "../types/gameTypes";
import { Team, Type } from "../types/enums";
import styled, { css } from "styled-components";
import King from "../assets/svg/chess-king-solid.svg?react";
import Queen from "../assets/svg/chess-queen-solid.svg?react";
import Pawn from "../assets/svg/chess-pawn-solid.svg?react";
import Knight from "../assets/svg/chess-knight-solid.svg?react";
import Rook from "../assets/svg/chess-rook-solid.svg?react";
import Bishop from "../assets/svg/chess-bishop-solid.svg?react";
import { useDispatch } from "react-redux";
import { selectPiece } from "../redux/slices/gameStateSlice";

type IconProps = {
  team: Team;
};
const commonCss = css`
  width: 80%;
  height: 80%;
`;
const KingIcon = styled(King)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.Black:
        return "black";
      case Team.White:
        return "white";
      case Team.Left:
        return "blue";
      case Team.Right:
        return "red";
    }
  }};
  ${commonCss}
`;

const QueenIcon = styled(Queen)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.Black:
        return "black";
      case Team.White:
        return "white";
      case Team.Left:
        return "blue";
      case Team.Right:
        return "red";
    }
  }};
  ${commonCss}
`;

const PawnIcon = styled(Pawn)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.Black:
        return "black";
      case Team.White:
        return "white";
      case Team.Left:
        return "blue";
      case Team.Right:
        return "red";
    }
  }};
  ${commonCss}
`;

const RookIcon = styled(Rook)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.Black:
        return "black";
      case Team.White:
        return "white";
      case Team.Left:
        return "blue";
      case Team.Right:
        return "red";
    }
  }};
  ${commonCss}
`;

const KnightIcon = styled(Knight)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.Black:
        return "black";
      case Team.White:
        return "white";
      case Team.Left:
        return "blue";
      case Team.Right:
        return "red";
    }
  }};
  ${commonCss}
`;

const BishopIcon = styled(Bishop)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.Black:
        return "black";
      case Team.White:
        return "white";
      case Team.Left:
        return "blue";
      case Team.Right:
        return "red";
    }
  }};
  ${commonCss}
`;

const IconWrapper = styled("div")`
  width: 50px;
  height: 50px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChessPiece: FC<{
  position: Position;
  type: Type;
  team: Team;
  id: string;
  gameId?: string;
}> = ({ position, type, team, id, gameId }) => {
  const dispatch = useDispatch();
  const handleMouseDown = () => {
    if (gameId) {
      dispatch(selectPiece({ gameId: gameId, id: id }));
    }
  };
  switch (type) {
    case Type.King:
      return (
        <IconWrapper
          onMouseDown={handleMouseDown}
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <KingIcon team={team} />
        </IconWrapper>
      );
    case Type.Queen:
      return (
        <IconWrapper
          onMouseDown={handleMouseDown}
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <QueenIcon team={team} />
        </IconWrapper>
      );
    case Type.Pawn:
      return (
        <IconWrapper
          onMouseDown={handleMouseDown}
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <PawnIcon team={team} />
        </IconWrapper>
      );
    case Type.Rook:
      return (
        <IconWrapper
          onMouseDown={handleMouseDown}
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <RookIcon team={team} />
        </IconWrapper>
      );
    case Type.Bishop:
      return (
        <IconWrapper
          onMouseDown={handleMouseDown}
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <BishopIcon team={team} />
        </IconWrapper>
      );
    case Type.Knight:
      return (
        <IconWrapper
          onMouseDown={handleMouseDown}
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <KnightIcon team={team} />
        </IconWrapper>
      );
  }
};

export default ChessPiece;
