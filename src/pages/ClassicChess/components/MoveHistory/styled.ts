import styled from "styled-components";

export const MainWrapper = styled("div")`
  background: ${({ theme }) => theme.colors.tertiary1};
  color: black;
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  position: relative;
  box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  border: 2px solid white;
`;

export const InnerWrapper = styled("div")`
  overflow-y: scroll;
  height: 500px;
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
  background: #FFFFFF69;
  font-size: 0.7rem;
  padding: 10px;
  margin-bottom: 5px;
`;
