import React from "react";
import { Container } from "react-bootstrap";

export default function FooterComponent() {
  return (
    <footer className="bg-dark text-light py-3 mt-4">
      <Container>
        <p className="mb-0 text-center">
          &copy; {new Date().getFullYear()} Royal Rentals. All Rights Reserved.
        </p>

        <p className="mb-0 text-center">
          Made with &hearts; by{" "}
          <a
            href="https://wasifmazhar.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light text-decoration-none"
          >
            Wasif Mazhar
          </a>
        </p>
      </Container>
    </footer>
  );
}
