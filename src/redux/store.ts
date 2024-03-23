import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./slices/gameStateSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    gameStateReducer,
    notificationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
