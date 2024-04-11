import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      const { data } = response; // Destructure the response data
      const { role } = data; // Extract the role from the response data
      localStorage.setItem("userRole", role); // Store user role in local storage
      console.log("Role set in local storage:", role); // Check if role is set correctly
      alert("Login successful!");
      if (role === "admin") {
        navigate("/");
      } else if (role === "staff") {
        navigate("/show-product");
      } else {
        navigate("/show-product"); // Navigate to login page if role is not recognized
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid phone number or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Mobile Number:
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
