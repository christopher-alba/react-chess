import styled from "styled-components";

export const MainWrapper = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  position: relative;
`;

export const SideInfoWrapper = styled("div")`
  width: 300px;
  height: 100%;
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
`;
