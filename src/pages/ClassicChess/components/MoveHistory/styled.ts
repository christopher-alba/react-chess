import styled from "styled-components";

export const MainWrapper = styled("div")`
  background: ${({ theme }) => theme.colors.tertiary1};
  color: black;
  width: 100%;
  height: 50%;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  flex-grow: 1;
  position: relative;
  border: 2px solid white;
  display: flex;
  flex-direction: column;
`;

export const InnerWrapper = styled("div")`
  overflow-y: auto;
  height: 100%;
  padding-right: 20px;
  box-sizing: border-box;
`;

export const Title = styled("h1")`
  font-size: 1.3rem;
  margin: 0;
  border-bottom: 4px solid white;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const MoveWrapper = styled("div")`
  background: #ffffff69;
  font-size: 0.7rem;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 5px;
`;
