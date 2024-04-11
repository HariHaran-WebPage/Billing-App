import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [staffList, setStaffList] = useState([]);

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
        "http://localhost:5000/Staff",
        formData
      );
      console.log(response.data);
      alert("Staff member created successfully!");
      fetchData(); // Fetch data again after adding a new staff member
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create staff member. Please try again.");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Staff");
      setStaffList(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch staff data. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/Staff/${id}`);
      console.log(response.data);
      alert("Staff member deleted successfully!");
      fetchData(); // Fetch data again after deleting a staff member
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete staff member. Please try again.");
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initial data when the component mounts
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">
            Mobile Number:
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <h2>Staff List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Action</th> {/* New column for delete button */}
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff._id}>
              <td>{staff.name}</td>
              <td>{staff.mobile}</td>
              <td>
                <button
                  onClick={() => handleDelete(staff._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>{" "}
              {/* Delete button */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffForm;
