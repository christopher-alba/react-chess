import styled from "styled-components";

export const MainWrapper = styled("div")`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary2};
`;
