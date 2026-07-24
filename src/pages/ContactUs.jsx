import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axiosClient from "../api/axiosClient";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(formData.name && formData.email && formData.message)) {
      // SweetAlert2 Error Popup
      Swal.fire({
        title: "Oops!",
        text: "Please fill out all required fields before submitting.",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Persist the message to json-server via axios
      await axiosClient.post("/messages", {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      // SweetAlert2 Success Popup
      Swal.fire({
        title: "Message Sent!",
        text: "Thank you for reaching out. Our support team will get back to you shortly.",
        icon: "success",
        confirmButtonColor: "#0d6efd",
      });

      // Clear the form
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      // The axios interceptor already handles connection errors; this covers
      // any other error json-server might return.
      if (error.response) {
        Swal.fire({
          title: "Oops!",
          text: "We couldn't send your message. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc3545",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Contact Us</h2>
            <p className="text-muted">
              Have a question? We would love to hear from you.
            </p>
          </div>

          <div className="p-4 border rounded shadow-sm bg-light">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={5}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
