import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import teamReducer from "./teamSlice";
import projectReducer from "./projectSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const rootReducer = combineReducers({
  user: persistedReducer,
  teams: teamReducer,
  projects: projectReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
