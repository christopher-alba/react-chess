import styled from "styled-components";
import { Container } from "../../../../components/container";

export const MainWrapper = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  position: relative;
`;

export const SideInfoWrapper = styled("div")`
  width: 300px;
  min-height: 75vh;
  max-height: 100vh;
  @media (max-width: 1300px) {
    height: 500px;
    width: 100%;
    margin-left: 0;
  }
  margin-left: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const GameControls = styled("div")`
  width: 100%;
  background: #383838;
  color: white;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  box-sizing: border-box;
  border: 2px solid white;
  @media (max-width: 1300px) {
    display: none;
  }
`;

export const StyledContainer = styled(Container)`
  @media (max-width: 1300px) {
    flex-direction: column;
    height: fit-content;
  }
  display: flex;
  position: relative;
  min-height: 75vh;
`;

export const SpectatorsWrapper = styled("div")`
  background: ${({ theme }) => theme.colors.primary3};
  height: 100%;
  padding: 20px;
  border-radius: 10px;
`;

export const Spectator = styled("div")`
  background: ${({ theme }) => theme.colors.primary1};
  color: ${({ theme }) => theme.colors.secondary1};
  text-align: center;
  padding: 10px;
`;
