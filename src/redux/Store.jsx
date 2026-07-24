import { configureStore } from "@reduxjs/toolkit";
import carsReducer from "./slices/carsSlice";
import rentalReducer from "./slices/rentalSlice";

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    rental: rentalReducer,
  },
});
