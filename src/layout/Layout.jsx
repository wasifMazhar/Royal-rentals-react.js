import React from "react";
import NavbarComponent from "../components/NavbarComponent";
import FooterComponent from "../components/FooterComponent";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";

export default function Layout() {
  return (
    <>
      <NavbarComponent />
      <Container className="my-4">
        <main>
          <Outlet />
        </main>
      </Container>
      <FooterComponent />
    </>
  );
}
