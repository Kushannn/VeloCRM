import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import organizationReducer from "./slices/orgSlice";
import projectReducer from "./slices/projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    projects: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
