import styled from "styled-components";
import { Container } from "../../../../components/container";

export const MainWrapper = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  position: relative;
`;

export const SideInfoWrapper = styled("div")`
  width: 300px;
  height: 100%;
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
  height: 75vh;
`;