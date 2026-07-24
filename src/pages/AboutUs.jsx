import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const About = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5 text-center">
        <Col>
          <h2 className="display-5 fw-bold mb-3">About Royal Rentals</h2>
          <p className="lead text-muted w-75 mx-auto">
            We are dedicated to providing the highest quality vehicles and
            exceptional customer service to make your travels as smooth as
            possible.
          </p>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <img
            src="/aboutImg.webp"
            alt="Driving on an open road"
            className="img-fluid rounded shadow"
          />
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <h3 className="fw-bold mb-3">Our Mission</h3>
          <p>
            Founded in 2026, our goal is to eliminate the hassle of car rentals.
            We believe in transparent pricing, a modern fleet, and a
            customer-first approach. Whether you need a compact car for city
            driving or a spacious SUV for a family road trip, we have you
            covered.
          </p>
          <p>
            With pick-up and drop-off locations across the country, we are
            always right where you need us.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
