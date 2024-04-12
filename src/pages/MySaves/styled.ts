import styled from "styled-components";

export const SaveWrapper = styled("div")`
  padding: 20px;
  border-radius: 15px;
  margin: 10px;
  box-shadow: ${({ theme }) => theme.colors.secondary1 + "22"} 0px 1px 3px 0px,
    ${({ theme }) => theme.colors.secondary1 + "22"} 0px 0px 0px 1px;
`;
