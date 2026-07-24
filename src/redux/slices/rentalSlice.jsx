import { createSlice } from "@reduxjs/toolkit";

const rentalSlice = createSlice({
  name: "rental",
  initialState: {
    selectedCar: null,
    rentalDetails: {},
    bookingQuantity: 1,
    bookingDays: 1,
  },
  reducers: {
    setSelectedCar(state, action) {
      state.selectedCar = action.payload;
    },
    setRentalDetails(state, action) {
      state.rentalDetails = action.payload;
    },
    setBookingSelection(state, action) {
      state.bookingQuantity = action.payload.quantity;
      state.bookingDays = action.payload.days;
    },
  },
});

export const { setSelectedCar, setRentalDetails, setBookingSelection } =
  rentalSlice.actions;
export default rentalSlice.reducer;
