import styled, { css } from "styled-components";
import King from "../../../../assets/svg/chess-king-solid.svg?react";
import Queen from "../../../../assets/svg/chess-queen-solid.svg?react";
import Pawn from "../../../../assets/svg/chess-pawn-solid.svg?react";
import Knight from "../../../../assets/svg/chess-knight-solid.svg?react";
import Rook from "../../../../assets/svg/chess-rook-solid.svg?react";
import Bishop from "../../../../assets/svg/chess-bishop-solid.svg?react";
import { Team } from "../../../../types/enums";

export const ModalBackdrop = styled("div")`
  width: 100vw;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #00000050;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBody = styled("div")`
  width: 350px;
  height: 100px;
  background: ${({ theme }) => theme.colors.tertiary1};
  padding: 50px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
`;

type IconProps = {
  team: Team;
};

export const PromoteButton = styled("button")`
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.colors.primary2};
  border: none;
  margin: 10px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primary1};
  }
`;

const commonCss = css`
  width: 60%;
  height: 60%;
  filter: drop-shadow(rgba(0, 0, 0, 0.5) 0px 4px 12px);
`;
export const KingIcon = styled(King)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.BlackPromotion:
        return "black";
      case Team.WhitePromotion:
        return "white";
    }
  }};
  ${commonCss}
`;

export const QueenIcon = styled(Queen)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.BlackPromotion:
        return "black";
      case Team.WhitePromotion:
        return "white";
    }
  }};
  ${commonCss}
`;

export const PawnIcon = styled(Pawn)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.BlackPromotion:
        return "black";
      case Team.WhitePromotion:
        return "white";
    }
  }};
  ${commonCss}
`;

export const RookIcon = styled(Rook)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.BlackPromotion:
        return "black";
      case Team.WhitePromotion:
        return "white";
    }
  }};
  ${commonCss}
`;

export const KnightIcon = styled(Knight)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.BlackPromotion:
        return "black";
      case Team.WhitePromotion:
        return "white";
    }
  }};
  ${commonCss}
`;

export const BishopIcon = styled(Bishop)<IconProps>`
  color: ${({ team }) => {
    switch (team) {
      case Team.BlackPromotion:
        return "black";
      case Team.WhitePromotion:
        return "white";
    }
  }};
  ${commonCss}
`;
