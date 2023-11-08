import { configureStore } from '@reduxjs/toolkit'
import { AlertSlice } from "store/AlertSlice";

const reducer = {
  notifications: AlertSlice.reducer
};

const store = configureStore({
  reducer
});

export default store;