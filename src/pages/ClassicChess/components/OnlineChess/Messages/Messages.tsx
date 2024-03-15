import { FC } from "react";
import styled from "styled-components";

const MainWrapper = styled("div")`
  background: ${({ theme }) => theme.colors.primary4};
  height: 40px;
`;

const Messages: FC = () => {
  return <MainWrapper></MainWrapper>;
};

export default Messages;
