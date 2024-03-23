import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Notification, Notifications } from "../../types/general";

export const notificationSlice = createSlice({
  name: "gameState",
  initialState: {
    notifications: [],
  } as Notifications,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      if (state.notifications.find((x) => x.message === action.payload.message))
        return;
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (x) => x.id !== action.payload
      );
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
