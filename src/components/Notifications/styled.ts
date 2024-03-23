import styled, { css } from "styled-components";
import Error from "../../assets/svg/error.svg?react";
import Info from "../../assets/svg/info-circle.svg?react";
import Warning from "../../assets/svg/warning.svg?react";
import Success from "../../assets/svg/tick-circle.svg?react";
import { NotificationType } from "../../types/enums";

export const MainWrapper = styled("div")`
  position: fixed;
  bottom: 50px;
  right: 0;
  display: flex;
  flex-direction: column-reverse;
  max-height: 70vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
type NotificationProps = {
  type: NotificationType;
};
export const NotificationWrapper = styled("div")<NotificationProps>`
  background: ${({ type }) => {
    return type === NotificationType.ERROR
      ? "#ff6969ff"
      : type === NotificationType.INFO
      ? "lightblue"
      : type === NotificationType.WARNING
      ? "orange"
      : "lightgreen";
  }};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  padding: 20px;
  margin: 10px 20px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
`;
const commonIconStyles = css`
  width: 40px;
  height: 40px;
`;
export const ErrorIcon = styled(Error)`
  ${commonIconStyles}
`;
export const InfoIcon = styled(Info)`
  ${commonIconStyles}
`;
export const WarningIcon = styled(Warning)`
  ${commonIconStyles}
`;
export const SuccessIcon = styled(Success)`
  ${commonIconStyles}
`;
export const Message = styled("p")`
  width: 70%;
  text-align: right;
`;
