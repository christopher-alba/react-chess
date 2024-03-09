import { FC } from "react";
import { Position } from "../../../types/gameTypes";
import { Team, Type } from "../../../types/enums";
import styled, { css } from "styled-components";
import King from "../../../assets/svg/chess-king-solid.svg?react";
import Queen from "../../../assets/svg/chess-queen-solid.svg?react";
import Pawn from "../../../assets/svg/chess-pawn-solid.svg?react";
import Knight from "../../../assets/svg/chess-knight-solid.svg?react";
import Rook from "../../../assets/svg/chess-rook-solid.svg?react";
import Bishop from "../../../assets/svg/chess-bishop-solid.svg?react";
import { useDispatch } from "react-redux";
import { selectPiece } from "../../../redux/slices/gameStateSlice";

type IconProps = {
  team: Team;
};
const commonCss = css`
  width: 60%;
  height: 60%;
  filter: drop-shadow(rgba(0, 0, 0, 0.5) 0px 4px 12px);
`;
const KingIcon = styled(King)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.Black:
        return "black";
      case Team.White:
        return "white";
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
    }
  }};
  ${commonCss}
`;

const IconWrapper = styled("div")`
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapperSmall = styled("div")`
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
  playerTeam: Team;
}> = ({ position, type, team, id, gameId, playerTeam }) => {
  const dispatch = useDispatch();
  const handleMouseDown = () => {
    console.log(playerTeam);
    
    if (gameId && playerTeam === team) {
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

export const ChessPieceSmall: FC<{
  position: Position;
  type: Type;
  team: Team;
  id: string;
  gameId?: string;
}> = ({ position, type, team }) => {
  switch (type) {
    case Type.King:
      return (
        <IconWrapperSmall
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <KingIcon team={team} />
        </IconWrapperSmall>
      );
    case Type.Queen:
      return (
        <IconWrapperSmall
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <QueenIcon team={team} />
        </IconWrapperSmall>
      );
    case Type.Pawn:
      return (
        <IconWrapperSmall
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <PawnIcon team={team} />
        </IconWrapperSmall>
      );
    case Type.Rook:
      return (
        <IconWrapperSmall
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <RookIcon team={team} />
        </IconWrapperSmall>
      );
    case Type.Bishop:
      return (
        <IconWrapperSmall
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <BishopIcon team={team} />
        </IconWrapperSmall>
      );
    case Type.Knight:
      return (
        <IconWrapperSmall
          className={`x-${position.x} y-${position.y} team-${team} type-${type}`}
        >
          <KnightIcon team={team} />
        </IconWrapperSmall>
      );
  }
};

export default ChessPiece;
