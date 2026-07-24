import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
  Alert,
  Pagination,
} from "react-bootstrap";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { fetchCars } from "../redux/slices/carsSlice";

const CARS_PER_PAGE = 9;

const DEFAULT_FILTERS = {
  category: "All",
  fuel: "All",
  transmission: "All",
  availability: "All",
  maxPrice: "",
  sortBy: "none",
  sortOrder: "asc",
};

export default function CarListing() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.cars);
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const updateDraft = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCars());
    }
  }, [status, dispatch]);

  // Debouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setDraftFilters((prev) => ({ ...prev, category: categoryFromUrl }));
      setAppliedFilters((prev) => ({ ...prev, category: categoryFromUrl }));
    }
  }, [searchParams]);

  const categoryOptions = useMemo(
    () => ["All", ...new Set(list.map((c) => c.category).filter(Boolean))],
    [list],
  );
  const fuelOptions = useMemo(
    () => ["All", ...new Set(list.map((c) => c.fuel).filter(Boolean))],
    [list],
  );
  const transmissionOptions = useMemo(
    () => ["All", ...new Set(list.map((c) => c.transmission).filter(Boolean))],
    [list],
  );

  const filteredCars = useMemo(() => {
    const {
      category,
      fuel,
      transmission,
      availability,
      maxPrice,
      sortBy,
      sortOrder,
    } = appliedFilters;

    let result = [...list];

    // Search
    if (debouncedSearch.trim()) {
      result = result.filter((car) =>
        car.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    // Category filter
    if (category !== "All") {
      result = result.filter((car) => car.category === category);
    }

    // Fuel filter
    if (fuel !== "All") {
      result = result.filter((car) => car.fuel === fuel);
    }

    // Transmission filter
    if (transmission !== "All") {
      result = result.filter((car) => car.transmission === transmission);
    }

    // Availability filter
    if (availability !== "All") {
      const wantAvailable = availability === "Available";
      result = result.filter((car) => Boolean(car.available) === wantAvailable);
    }

    // Max price filter
    if (maxPrice !== "" && !Number.isNaN(Number(maxPrice))) {
      result = result.filter((car) => car.price <= Number(maxPrice));
    }

    // Sorting
    if (sortBy !== "none") {
      result.sort((a, b) => {
        const diff = a[sortBy] - b[sortBy];
        return sortOrder === "asc" ? diff : -diff;
      });
    }

    return result;
  }, [list, debouncedSearch, appliedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, appliedFilters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCars.length / CARS_PER_PAGE),
  );

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * CARS_PER_PAGE;
    return filteredCars.slice(start, start + CARS_PER_PAGE);
  }, [filteredCars, currentPage]);

  // Function to highlight matched text
  const highlightMatch = (text) => {
    if (!debouncedSearch.trim()) return text;
    const regex = new RegExp(`(${debouncedSearch})`, "gi");
    return text.split(regex).map((part, idx) =>
      part.toLowerCase() === debouncedSearch.toLowerCase() ? (
        <span key={idx} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    setSearch("");
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="d-flex justify-content-center mb-3">
        <InputGroup style={{ maxWidth: "600px", width: "100%" }}>
          <Form.Control
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="primary">
            <FaSearch />
          </Button>
        </InputGroup>
      </div>

      {/* Filters + Sorting (draft state; nothing here filters the list until Apply is clicked) */}
      <Row className="g-2 align-items-end mb-4 justify-content-center mx-0">
        <Col xs={6} sm={4} md={2}>
          <Form.Label className="small mb-1">Category</Form.Label>
          <Form.Select
            value={draftFilters.category}
            onChange={(e) => updateDraft("category", e.target.value)}
          >
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={6} sm={4} md={2}>
          <Form.Label className="small mb-1">Fuel</Form.Label>
          <Form.Select
            value={draftFilters.fuel}
            onChange={(e) => updateDraft("fuel", e.target.value)}
          >
            {fuelOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={6} sm={4} md={2}>
          <Form.Label className="small mb-1">Transmission</Form.Label>
          <Form.Select
            value={draftFilters.transmission}
            onChange={(e) => updateDraft("transmission", e.target.value)}
          >
            {transmissionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={6} sm={4} md={2}>
          <Form.Label className="small mb-1">Availability</Form.Label>
          <Form.Select
            value={draftFilters.availability}
            onChange={(e) => updateDraft("availability", e.target.value)}
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </Form.Select>
        </Col>

        {/* Max price: small typed input */}
        <Col xs={6} sm={4} md={2}>
          <Form.Label className="small mb-1">Max Price</Form.Label>
          <Form.Control
            type="number"
            min="0"
            placeholder="e.g. 300"
            value={draftFilters.maxPrice}
            onChange={(e) => updateDraft("maxPrice", e.target.value)}
          />
        </Col>

        {/* Sort field + direction */}
        <Col xs={6} sm={4} md={2}>
          <Form.Label className="small mb-1">Sort By</Form.Label>
          <InputGroup>
            <Form.Select
              value={draftFilters.sortBy}
              onChange={(e) => updateDraft("sortBy", e.target.value)}
            >
              <option value="none">None</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="year">Year</option>
            </Form.Select>
            <Button
              variant="outline-secondary"
              disabled={draftFilters.sortBy === "none"}
              onClick={() =>
                updateDraft(
                  "sortOrder",
                  draftFilters.sortOrder === "asc" ? "desc" : "asc",
                )
              }
              title={
                draftFilters.sortOrder === "asc" ? "Ascending" : "Descending"
              }
            >
              {draftFilters.sortOrder === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              )}
            </Button>
          </InputGroup>
        </Col>

        {/* Apply + Reset */}
        <Col xs={6} sm={4} md={2} className="d-flex gap-2">
          <Button variant="primary" className="w-100" onClick={applyFilters}>
            Apply
          </Button>
          <Button
            variant="outline-dark"
            className="w-100"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </Col>
      </Row>

      {/* Loading state */}
      {status === "loading" && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading cars...</span>
          </Spinner>
        </div>
      )}

      {/* Error state */}
      {status === "failed" && (
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
      )}

      {/* Result count */}
      {status === "succeeded" && (
        <p className="text-center text-muted mb-3">
          {filteredCars.length} car{filteredCars.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Car Listings — justify-content-center keeps the grid centered on
          tablet/mobile widths, including when the last row has an odd
          number of cards left over */}
      {status === "succeeded" && (
        <Row className="g-4 justify-content-center mx-0">
          {paginatedCars.map((car) => (
            <Col
              key={car.id}
              xs={12}
              sm={10}
              md={6}
              lg={4}
              className="d-flex justify-content-center"
            >
              <CarCard car={car} highlightedName={highlightMatch(car.name)} />
            </Col>
          ))}
        </Row>
      )}

      {status === "succeeded" && filteredCars.length === 0 && (
        <Alert variant="secondary" className="text-center">
          No cars match your current filters.
        </Alert>
      )}

      {/* Pagination — only shown once there's more than one page */}
      {status === "succeeded" && filteredCars.length > CARS_PER_PAGE && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            />

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </>
  );
}
