import { NotificationType } from "./enums";

export type Notification = {
  message: string;
  type: NotificationType;
  id: string;
};

export type Notifications = { notifications: Notification[] };
