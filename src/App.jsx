import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import CarListing from "./pages/CarListing";
import CarDetail from "./pages/CarDetail";
import FormPage from "./pages/FormPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutUs /> },
      { path: "contact", element: <ContactUs /> },
      { path: "cars", element: <CarListing /> },
      { path: "cars/:id", element: <CarDetail /> },
      { path: "rent", element: <FormPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
