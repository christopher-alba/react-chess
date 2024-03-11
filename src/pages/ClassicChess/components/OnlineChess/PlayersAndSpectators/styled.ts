import styled from "styled-components";
import TickCircle from "../../../../../assets/svg/tick-circle.svg?react";

export const MainWrapper = styled("div")`
  width: 320px;
  background: #383838;
  min-height: calc(100vh - 80px);
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  @media (max-width: 1300px){
    display: none;
  }
`;

export const SmallPrint = styled("p")`
  font-size: 0.7rem;
  margin: 0;
  font: Consolas;
  color: black;
`;
export const GameIdHeader = styled("div")`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const TickCircleIcon = styled(TickCircle)`
  width: 0.9rem;
  height: 0.9rem;
`;

export const GameIdBackground = styled("div")`
  background: ${({ theme }) => theme.colors.tertiary1};
  padding: 10px;
`;

export const Header = styled("p")`
  margin: 0;
  margin-top: 20px;
`;


