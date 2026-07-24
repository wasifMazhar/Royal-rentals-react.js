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
      style={{
        width: "18rem",
        height: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        cursor: "pointer",
      }}
      className="mb-4 shadow-sm"
      onClick={handleCardClick}
    >
      <div
        style={{ position: "relative", height: "140px", overflow: "hidden" }}
      >
        <Card.Img
          variant="top"
          src={car.images[0]}
          alt={car.name}
          width={288}
          height={140}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
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
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          zIndex: 2,
          padding: "3px 10px",
          borderRadius: "12px",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: isAvailable ? "#0f5132" : "#842029",
          backgroundColor: isAvailable
            ? "rgba(25, 135, 84, 0.18)"
            : "rgba(220, 53, 69, 0.18)",
          border: isAvailable
            ? "1px solid rgba(25, 135, 84, 0.35)"
            : "1px solid rgba(220, 53, 69, 0.35)",
          backdropFilter: "blur(2px)",
        }}
      >
        {isAvailable ? "Available" : "Not Available"}
      </span>
    </Card>
  );
}
