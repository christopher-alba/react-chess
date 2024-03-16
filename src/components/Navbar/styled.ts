import { Link } from "react-router-dom";
import styled from "styled-components";

export const MainWrapper = styled("div")`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.primary1};
  padding: 10px 30px;
  box-sizing: border-box;
`;

export const NavCompartment = styled("div")`
  display: flex;
  align-items: center;
`;

export const Brand = styled("h1")`
  font-size: 2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 800;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.colors.secondary1};
`;

export const TertiarySpan = styled("span")`
  color: ${({ theme }) => theme.colors.tertiaryMain};
`;

export const StyledLink = styled(Link)`
  margin-left: 50px;
  color: ${({ theme }) => theme.colors.secondary3};
  text-decoration: none;
  font-weight: 700;
  &:first-of-type {
    margin-left: 150px;
  }
`;