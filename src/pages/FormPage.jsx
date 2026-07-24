import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setRentalDetails } from "../redux/slices/rentalSlice";
import { decrementCarQuantity } from "../redux/slices/carsSlice";
import { Button } from "react-bootstrap";
import axiosClient from "../api/axiosClient";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .required("Name is required"),

  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .length(11, "Phone number must be exactly 11 digits"),

  pickupDate: Yup.date()
    .required("Pickup date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Pickup date cannot be in the past",
    ),
});

export default function FormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCar, bookingQuantity, bookingDays } = useSelector(
    (state) => state.rental,
  );

  if (!selectedCar) return <p>No car selected.</p>;

  return (
    <Formik
      initialValues={{ name: "", phone: "", pickupDate: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          // Persist the booking to json-server via axios
          await axiosClient.post("/bookings", {
            ...values,
            carId: selectedCar.id,
            carName: selectedCar.name,
            quantity: bookingQuantity,
            days: bookingDays,
            createdAt: new Date().toISOString(),
          });

          dispatch(setRentalDetails(values));

          try {
            await dispatch(
              decrementCarQuantity({
                carId: selectedCar.id,
                amount: bookingQuantity,
              }),
            ).unwrap();
          } catch (stockError) {
            console.error("Failed to update car stock:", stockError);
          }

          await Swal.fire({
            title: "Booking Confirmed!",
            text: `Your booking for ${selectedCar.name} has been confirmed.`,
            icon: "success",
            confirmButtonColor: "#198754",
          });

          resetForm();
          navigate("/cars");
        } catch (error) {
          if (error.response) {
            Swal.fire({
              title: "Booking Failed",
              text: "Something went wrong while saving your booking. Please try again.",
              icon: "error",
              confirmButtonColor: "#dc3545",
            });
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-3">
            <label>Name</label>
            <Field name="name" className="form-control" />
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label>Phone</label>
            <Field
              name="phone"
              type="text"
              maxLength={11}
              className="form-control"
            />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="mb-3">
            <label>Pickup Date</label>
            <Field name="pickupDate" type="date" className="form-control" />
            <ErrorMessage
              name="pickupDate"
              component="div"
              className="text-danger"
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
