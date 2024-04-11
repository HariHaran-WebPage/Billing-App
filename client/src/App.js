import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuBar from "./Meubar";
import StaffForm from "./StaffDashbord/StaffDashbord";
import LoginForm from "./LoginPage";
import ProductForm from "./AddProduct";
import CustomerDetails from "./View Invoice";
import StoreForm from "./CreatCustomer";
import Footer from "./Footer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/staff-dashboard"
          element={<AuthenticatedRoute component={<StaffForm />} />}
        />
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/add-product"
          element={<AuthenticatedRoute component={<ProductForm />} />}
        />
        <Route
          path="/show-product"
          element={<AuthenticatedRoute component={<CustomerDetails />} />}
        />
        <Route
          path="/create-customer"
          element={<AuthenticatedRoute component={<StoreForm />} />}
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

const AuthenticatedRoute = ({ component: Component }) => {
  const location = window.location.pathname;

  // Check if the current location is the login page
  const isLoginPage = location === "/";

  return (
    <>
      {!isLoginPage && <MenuBar />}
      {Component}
      {!isLoginPage && <Footer />}
    </>
  );
};

export default App;
