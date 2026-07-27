import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

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
  },
});

export default carsSlice.reducer;
