import { Link } from "react-router-dom";
import styled from "styled-components";
interface ButtonProps {
  $background?: string;
  $textColor?: string;
  $border?: string;
  $boxShadow?: string;
  $width?: string;
  $fontSize?: string;
}

export const Button = styled.button<ButtonProps>`
  background: ${(props) => props.$background || "transparent"};
  color: ${(props) => props.$textColor || "#000"};
  border: ${(props) => props.$border || "none"};
  box-shadow: ${(props) => props.$boxShadow || "none"};
  width: ${(props) => props.$width || "fit-content"};
  font-size: ${(props) => props.$fontSize || "0.8rem"};
  padding: 5px 16px;
  min-height: 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.$background + "AA"};
    border: ${(props) => props.$border || "none"};
    box-shadow: ${(props) => props.$boxShadow || "none"};
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonLink = styled(Link)<ButtonProps>`
  background: ${(props) => props.$background || "transparent"};
  color: ${(props) => props.$textColor || "#000"};
  border: ${(props) => props.$border || "none"};
  box-shadow: ${(props) => props.$boxShadow || "none"};
  width: ${(props) => props.$width || "fit-content"};
  font-size: ${(props) => props.$fontSize || "0.8rem"};
  padding: 5px 16px;
  text-decoration: none;
  min-height: 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.$background + "AA"};
    border: ${(props) => props.$border || "none"};
    box-shadow: ${(props) => props.$boxShadow || "none"};
  }
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;
