import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCarSide,
  FaUsers,
  FaStar,
  FaShieldAlt,
  FaHeadset,
  FaMoneyBillWave,
  FaArrowRight,
  FaGem,
  FaTachometerAlt,
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const heroImage = "/hero.webp";

  const cardStyle = (index) => ({
    transition: "0.3s",
    cursor: "pointer",
    transform: hoveredCard === index ? "translateY(-8px)" : "translateY(0)",
    boxShadow:
      hoveredCard === index
        ? "0 10px 25px rgba(0,0,0,.18)"
        : "0 4px 12px rgba(0,0,0,.08)",
  });

  const goToCars = (category) => {
    if (category) {
      navigate(`/cars?category=${encodeURIComponent(category)}`);
    } else {
      navigate("/cars");
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#0a58ca)",
        }}
      >
        <Container className="py-5">
          <Row className="align-items-center g-5">
            <Col lg={6} className="text-center text-lg-start">
              <span className="badge bg-warning text-dark px-3 py-2 mb-3">
                Premium Car Rental Service
              </span>

              <h1 className="display-4 fw-bold">Drive Your Dream Car Today</h1>

              <p className="lead mt-3">
                Rent luxury, economy, SUVs and sports cars at affordable prices.
                Fast booking, premium service and unforgettable journeys.
              </p>

              <div className="mt-4 d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Button size="lg" variant="warning" onClick={() => goToCars()}>
                  Browse Fleet <FaArrowRight className="ms-2" />
                </Button>

                <Button
                  size="lg"
                  variant="outline-light"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button>
              </div>
            </Col>

            <Col lg={6} className="text-center">
              <img
                src={heroImage}
                alt="Luxury Car"
                className="img-fluid"
                style={{
                  maxHeight: "380px",
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* STATS */}

      <Container className="my-5">
        <Row className="g-4">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaCarSide size={40} className="text-primary mb-3" />
                <h3>40+</h3>
                <p className="text-muted mb-0">Premium Vehicles</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaUsers size={40} className="text-success mb-3" />
                <h3>1000+</h3>
                <p className="text-muted mb-0">Happy Customers</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaStar size={40} className="text-warning mb-3" />
                <h3>4.9</h3>
                <p className="text-muted mb-0">Customer Rating</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaShieldAlt size={40} className="text-danger mb-3" />
                <h3>100%</h3>
                <p className="text-muted mb-0">Secure Booking</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* FEATURED SERVICES */}

      <Container className="mb-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Choose Your Ride</h2>

          <p className="text-muted">
            Find the perfect vehicle for every journey.
          </p>
        </div>

        <Row className="g-4">
          <Col md={3} sm={6}>
            <Card
              className="h-100 border-0"
              style={cardStyle(1)}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Body className="text-center p-4">
                <FaCarSide size={45} className="text-primary mb-3" />

                <h4>Economy</h4>

                <p className="text-muted">
                  Affordable and fuel-efficient vehicles for your everyday
                  trips.
                </p>

                <Button
                  variant="outline-primary"
                  onClick={() => goToCars("Economy")}
                >
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card
              className="h-100 border-0"
              style={cardStyle(2)}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Body className="text-center p-4">
                <FaGem size={45} className="text-info mb-3" />

                <h4>Premium</h4>

                <p className="text-muted">
                  Elevated comfort and refined tech for everyday driving with an
                  edge.
                </p>

                <Button
                  variant="outline-info"
                  onClick={() => goToCars("Premium")}
                >
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card
              className="h-100 border-0"
              style={cardStyle(3)}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Body className="text-center p-4">
                <FaStar size={45} className="text-warning mb-3" />

                <h4>Luxury</h4>

                <p className="text-muted">
                  Travel with elegance, comfort and premium performance cars.
                </p>

                <Button
                  variant="outline-warning"
                  onClick={() => goToCars("Luxury")}
                >
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card
              className="h-100 border-0"
              style={cardStyle(4)}
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Body className="text-center p-4">
                <FaTachometerAlt size={45} className="text-danger mb-3" />

                <h4>Supercar</h4>

                <p className="text-muted">
                  Powerful performance and thrilling driving experience for
                  every adventure.
                </p>

                <Button
                  variant="outline-danger"
                  onClick={() => goToCars("Supercar")}
                >
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* WHY CHOOSE US */}

      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose Us?</h2>

            <p className="text-muted">
              We make renting a car simple, affordable and reliable.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card
                className="border-0 shadow-sm h-100 text-center"
                style={cardStyle(5)}
                onMouseEnter={() => setHoveredCard(5)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card.Body className="p-4">
                  <FaHeadset size={45} className="text-primary mb-3" />

                  <h4>24/7 Support</h4>

                  <p className="text-muted">
                    Our support team is always available to assist you wherever
                    your journey takes you.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card
                className="border-0 shadow-sm h-100 text-center"
                style={cardStyle(6)}
                onMouseEnter={() => setHoveredCard(6)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card.Body className="p-4">
                  <FaMoneyBillWave size={45} className="text-success mb-3" />

                  <h4>Affordable Prices</h4>

                  <p className="text-muted">
                    Transparent pricing with no hidden charges and excellent
                    value for money.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card
                className="border-0 shadow-sm h-100 text-center"
                style={cardStyle(7)}
                onMouseEnter={() => setHoveredCard(7)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card.Body className="p-4">
                  <FaShieldAlt size={45} className="text-danger mb-3" />

                  <h4>Safe & Secure</h4>

                  <p className="text-muted">
                    Every vehicle is inspected regularly to guarantee your
                    comfort and safety.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CALL TO ACTION */}

      <section
        className="py-5 text-center text-white"
        style={{
          background: "linear-gradient(135deg,#0d6efd,#6610f2)",
        }}
      >
        <Container>
          <h2 className="fw-bold">Ready For Your Next Journey?</h2>

          <p className="lead mb-4">
            Browse our premium collection and book your favorite car in just a
            few clicks.
          </p>

          <Button variant="warning" size="lg" onClick={() => goToCars()}>
            Browse Cars
          </Button>
        </Container>
      </section>
    </>
  );
}
