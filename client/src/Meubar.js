import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

const MenuBar = () => {
  // Retrieve the user's role from local storage
  const role = localStorage.getItem("userRole") || "guest"; // Default role is "guest" if not found
  console.log("Role:", role); // Add a console log to check the role

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home" className="mr-auto">
        Billing App
      </Navbar.Brand>{" "}
      {/* 'mr-auto' pushes the brand/logo to the left */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {" "}
          {/* 'ml-auto' pushes the menu items to the right */}
          {role === "admin" && (
            <>
              <Nav.Link as={Link} to="/show-product">
                View Invoice
              </Nav.Link>
              <Nav.Link as={Link} to="/staff-dashboard">
                Staff Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/add-product">
                Add Product
              </Nav.Link>
              <Nav.Link as={Link} to="/create-customer">
                Create Customer
              </Nav.Link>
            </>
          )}
          {role === "staff" && (
            <>
              <Nav.Link as={Link} to="/show-product">
                View Invoice
              </Nav.Link>
            </>
          )}
          {role === "guest" && (
            <>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            </>
          )}
          <Nav.Link as={Link} to="/">
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MenuBar;
