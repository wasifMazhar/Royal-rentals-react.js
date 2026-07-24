import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import {
  setSelectedCar,
  setBookingSelection,
} from "../redux/slices/rentalSlice";
import { fetchCars } from "../redux/slices/carsSlice";

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.cars);
  const { selectedCar } = useSelector((state) => state.rental);

  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCars());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (!selectedCar && list.length > 0) {
      const foundCar = list.find((c) => c.id === id);
      if (foundCar) {
        dispatch(setSelectedCar(foundCar));
      }
    }
  }, [id, list, selectedCar, dispatch]);

  // If the selected car only has, say, 2 in stock but quantity was left at a
  // higher value from a previous car, clamp it back down whenever the car
  // (or its stock) changes.
  useEffect(() => {
    if (!selectedCar) return;
    const max =
      typeof selectedCar.quantity === "number"
        ? selectedCar.quantity
        : Infinity;
    setQuantity((prev) => Math.min(prev, Math.max(max, 1)));
  }, [selectedCar]);

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading car details...</span>
        </Spinner>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <Alert variant="danger" className="text-center">
        {error}{" "}
        <Button
          variant="outline-danger"
          size="sm"
          className="ms-2"
          onClick={() => dispatch(fetchCars())}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (!selectedCar) return <p>Loading car details...</p>;

  // How many of this car are actually left. Falls back to unlimited if the
  // record doesn't have a quantity field yet, so nothing breaks mid-migration.
  const maxQuantity =
    typeof selectedCar.quantity === "number" ? selectedCar.quantity : Infinity;
  const isOutOfStock = maxQuantity <= 0;

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value, 10) || 1;
    if (value < 1) value = 1;
    if (maxQuantity !== Infinity && value > maxQuantity) value = maxQuantity;
    setQuantity(value);
  };

  const totalPricePKR = (
    selectedCar.price *
    200 *
    quantity *
    days
  ).toLocaleString();

  const renderRating = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-warning me-1" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning me-1" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning me-1" />);
      }
    }

    return stars;
  };

  // Store the chosen quantity/days in rentalSlice so FormPage (and, after
  // that, the stock-decrement logic) knows exactly how many units to book
  // and subtract — previously this information never left this page.
  const handleRentClick = () => {
    dispatch(setBookingSelection({ quantity, days }));
    navigate("/rent");
  };

  return (
    <>
      {/* Main Car Detail */}
      <Row className="my-4">
        <Col
          md={5}
          className="d-flex align-items-center justify-content-center"
        >
          <img
            src={selectedCar.images[0]}
            alt={selectedCar.name}
            style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
          />
        </Col>

        <Col md={7}>
          <h2>{selectedCar.name}</h2>
          <h5 className="text-muted">{selectedCar.make}</h5>
          <p className="mt-3">{selectedCar.description}</p>
          <h6 className="text-secondary">{selectedCar.category}</h6>
          <div className="d-flex align-items-center mb-3">
            {renderRating(selectedCar.rating)}
            <span className="ms-2 text-muted">({selectedCar.rating})</span>
          </div>
          <h4 className="text-success">
            {(selectedCar.price * 200).toLocaleString()} PKR / day
          </h4>

          {isOutOfStock && (
            <Alert variant="danger" className="mt-3">
              This car is currently not available for booking.
            </Alert>
          )}

          <Form className="mt-4">
            <Form.Group controlId="quantity" className="mb-3">
              <Form.Label>
                Number of Cars
                {maxQuantity !== Infinity && !isOutOfStock && (
                  <span
                    className="text-muted ms-2"
                    style={{ fontSize: "0.85rem" }}
                  >
                    ({maxQuantity} available)
                  </span>
                )}
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={maxQuantity !== Infinity ? maxQuantity : undefined}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isOutOfStock}
                style={{ width: "100px" }}
              />
            </Form.Group>

            <Form.Group controlId="days" className="mb-3">
              <Form.Label>Number of Days</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                disabled={isOutOfStock}
                style={{ width: "100px" }}
              />
            </Form.Group>
          </Form>

          <h5 className="mt-3">
            Total Price:{" "}
            <span className="text-primary">{totalPricePKR} PKR</span>
          </h5>

          <Button
            variant="success"
            size="lg"
            className="mt-3"
            disabled={isOutOfStock}
            onClick={handleRentClick}
          >
            {isOutOfStock ? "Not Available" : "Rent This Car"}
          </Button>
        </Col>
      </Row>
    </>
  );
}
