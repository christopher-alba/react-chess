import styled from "styled-components";

export const LobbyWrapper = styled("div")`
  background: ${({ theme }) => theme.colors.primary2};
  width: 100%;
  margin: 5px 0;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ControlsWrapper = styled("div")`
  & > * {
    margin-bottom: 10px;
  }
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const PasswordInput = styled("input")`
  width: 100%;
  box-sizing: border-box;
  height: 30px;
  text-align: center;
  background: ${({ theme }) => theme.colors.primary4};
  color: ${({ theme }) => theme.colors.secondary1};
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.secondary1};
`;
