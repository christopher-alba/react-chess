import styled from "styled-components";

export const ButtonGroup = styled("div")`
  display: flex;
  margin-top: 20px;
  & > *:first-of-type {
    border-top-left-radius: 5px !important;
    border-bottom-left-radius: 5px !important;
  }

  & > *:last-of-type {
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
    margin-right: 0 !important;
  }

  & > * {
    border-radius: 0 !important;
    flex-grow: 1;
    margin-right: 1px !important;
  }
`;
