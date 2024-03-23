import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Notification } from "../../types/general";
import {
  ErrorIcon,
  InfoIcon,
  MainWrapper,
  Message,
  NotificationWrapper,
  SuccessIcon,
  WarningIcon,
} from "./styled";
import { NotificationType } from "../../types/enums";
import { removeNotification } from "../../redux/slices/notificationSlice";

const Notifications: FC = () => {
  const notificationState = useSelector(
    (state: RootState) => state.notificationReducer
  );

  return (
    <MainWrapper>
      {notificationState.notifications
        .map((x) => <NotificationComponent key={x.id} notification={x} />)
        .reverse()}
    </MainWrapper>
  );
};

export default Notifications;

const NotificationComponent: FC<{ notification: Notification }> = ({
  notification,
}) => {
  const dispatch = useDispatch();
  const unMount = () => {
    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 2000);
  };
  useEffect(() => {
    unMount();
  });
  return (
    <NotificationWrapper type={notification.type}>
      {notification?.type === NotificationType.ERROR ? (
        <ErrorIcon />
      ) : notification?.type === NotificationType.INFO ? (
        <InfoIcon />
      ) : notification?.type === NotificationType.WARNING ? (
        <WarningIcon />
      ) : (
        <SuccessIcon />
      )}
      <Message>{notification?.message}</Message>
    </NotificationWrapper>
  );
};
