import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// Fetches the car fleet from the json-server API (db.json -> "cars")
export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/cars");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load cars. Please make sure the API server is running.",
      );
    }
  },
);

// Called right after a booking is successfully saved. Re-reads the car's
// current quantity from the server (in case it changed since this page
// loaded), subtracts the number that was just rented, floors at 0, and
// flips `available` to false once stock hits 0. Returns the updated car so
// the reducer can patch it straight into state.list.
export const decrementCarQuantity = createAsyncThunk(
  "cars/decrementCarQuantity",
  async ({ carId, amount }, { rejectWithValue }) => {
    try {
      const { data: currentCar } = await axiosClient.get(`/cars/${carId}`);
      const currentQuantity =
        typeof currentCar.quantity === "number" ? currentCar.quantity : 0;
      const newQuantity = Math.max(0, currentQuantity - amount);

      const { data: updatedCar } = await axiosClient.patch(`/cars/${carId}`, {
        quantity: newQuantity,
        available: newQuantity > 0,
      });

      return updatedCar;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update car availability after booking.",
      );
    }
  },
);

const carsSlice = createSlice({
  name: "cars",
  initialState: {
    list: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(decrementCarQuantity.fulfilled, (state, action) => {
        const updatedCar = action.payload;
        const index = state.list.findIndex((c) => c.id === updatedCar.id);
        if (index !== -1) {
          state.list[index] = updatedCar;
        }
      });
    // Note: no .pending/.rejected handling for decrementCarQuantity on
    // purpose — the booking itself already succeeded by the time this
    // runs, so a failure here shouldn't show as a failed booking. It's
    // logged/alerted from FormPage instead (see that file).
  },
});

export default carsSlice.reducer;
