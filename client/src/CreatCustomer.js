import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerForm = () => {
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/storeall");
        setCustomers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/store", {
        name,
        shopName,
      });
      setCustomers([...customers, response.data]); // Add new customer to the list
      setName(""); // Clear input fields after submission
      setShopName("");
    } catch (err) {
      setErrorMessage(err.response.data.message);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`http://localhost:5000/store/${customerId}`);
      setCustomers(customers.filter((customer) => customer._id !== customerId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Create Customer</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Shop Name:</label>
          <input
            type="text"
            className="form-control"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>

      <div>
        <h1>Customer Table</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Shop Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.shopName}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(customer._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerForm;
