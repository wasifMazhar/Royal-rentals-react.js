import React from "react";
import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSelectedCar } from "../redux/slices/rentalSlice";
import { useNavigate } from "react-router-dom";

export default function CarCard({ car, highlightedName }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAvailable =
    typeof car.isAvailable === "boolean"
      ? car.isAvailable
      : Boolean(car.available) &&
        (typeof car.quantity !== "number" || car.quantity > 0);

  const handleCardClick = () => {
    dispatch(setSelectedCar(car));
    navigate(`/cars/${car.id}`);
  };

  return (
    <Card
      className="mb-4 shadow-sm d-flex flex-column justify-content-between position-relative"
      style={{
        width: "18rem",
        height: "300px",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <div
        className="position-relative overflow-hidden"
        style={{ height: "140px" }}
      >
        <Card.Img
          variant="top"
          src={car.images[0]}
          alt={car.name}
          className="w-100 h-100 object-fit-contain"
        />
      </div>

      <Card.Body style={{ flex: "1 1 auto" }}>
        <Card.Title>{highlightedName || car.name}</Card.Title>
        <Card.Text style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
          {car.make} <br />
          {(car.price * 200).toLocaleString()} PKR / day
        </Card.Text>
        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          View Details
        </Button>
      </Card.Body>

      <span
        className={`position-absolute bottom-0 end-0 me-2 mb-3 px-2 py-1 rounded-pill fw-semibold small border ${
          isAvailable ? "text-success" : "text-danger"
        }`}
        style={{
          zIndex: 2,
          backgroundColor: isAvailable
            ? "rgba(25, 135, 84, 0.18)"
            : "rgba(220, 53, 69, 0.18)",
          borderColor: isAvailable
            ? "rgba(25, 135, 84, 0.35)"
            : "rgba(220, 53, 69, 0.35)",
          backdropFilter: "blur(2px)",
          fontSize: "0.7rem",
        }}
      >
        {isAvailable ? "Available" : "Not Available"}
      </span>
    </Card>
  );
}
