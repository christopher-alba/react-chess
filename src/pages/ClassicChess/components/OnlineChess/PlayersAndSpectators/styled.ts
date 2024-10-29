import styled from "styled-components";
import TickCircle from "../../../../../assets/svg/tick-circle.svg?react";

export const MainWrapper = styled("div")`
  width: 320px;
  background: ${({ theme }) => theme.colors.primary3};
  min-height: calc(100vh - 80px);
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.secondary1};
  @media (max-width: 1300px) {
    display: none;
  }
`;

export const MainWrapperMobile = styled("div")`
  width: 100%;
  display: none;
  background: ${({ theme }) => theme.colors.primary1 + "EE"};
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1000;
  @media (max-width: 1300px) {
    display: flex;
  }
`;

export const InnerWrapperMobile = styled("div")`
  width: 320px;
  max-width: 70%;
  background: ${({ theme }) => theme.colors.primary3};
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.secondary1};
`;

export const SmallPrint = styled("p")`
  font-size: 0.7rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary1};
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
  background: ${({ theme }) => theme.colors.primary4};
  padding: 10px;
`;

export const Header = styled("p")`
  margin: 0;
  margin-top: 20px;
`;

export const MobileNavCloseButton = styled("button")`
  position: fixed;
  top: 20px;
  left: 340px;
  @media (max-width: 600px){
    left: 75%;
  }
  font-size: 2rem;
  background: none;
  color:${({ theme }) => theme.colors.secondary1};
  border: 1px solid ${({ theme }) => theme.colors.secondary1};
  border-radius: 50%;
  width: 50px;
  height: 50px;
`;

export const ShowMenuButton = styled("button")`
  display: none;
  position: absolute;
  height: 40px;
  padding: 10px 30px;
  background: ${({theme}) => theme.colors.secondary1};
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  @media (max-width: 1300px) {
    display: inline-block;
  }
`;
