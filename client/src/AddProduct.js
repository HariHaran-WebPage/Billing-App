import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ProductForm = () => {
  const [name, setName] = useState("");
  const [priceForPC, setPriceForPC] = useState(0);
  const [priceForBox, setPriceForBox] = useState(0);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false); // Track if in edit mode
  const [editProductId, setEditProductId] = useState(null); // Track edited product ID
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/allproduct");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching products");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // If in edit mode, update the product
        await axios.put(`http://localhost:5000/product/${editProductId}`, {
          name,
          priceForPC,
          priceForBox,
        });
        setEditMode(false); // Exit edit mode after update
      } else {
        // Otherwise, create a new product
        const response = await axios.post("http://localhost:5000/product", {
          name,
          priceForPC,
          priceForBox,
        });
        setProducts([...products, response.data]);
      }
      clearForm();
    } catch (err) {
      console.error(err);
      setErrorMessage("Error saving product");
    }
  };

  const handleEdit = (productId) => {
    const productToEdit = products.find((product) => product._id === productId);
    if (productToEdit) {
      setName(productToEdit.name);
      setPriceForPC(productToEdit.priceForPC);
      setPriceForBox(productToEdit.priceForBox);
      setEditMode(true);
      setEditProductId(productId);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      console.error(err);
      setErrorMessage("Error deleting product");
    }
  };

  const clearForm = () => {
    setName("");
    setPriceForPC(0);
    setPriceForBox(0);
    setEditMode(false); // Reset edit mode
    setEditProductId(null); // Reset edited product ID
  };

  return (
    <div className="container">
      <h1>{editMode ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="priceForPC" className="form-label">
            Price for PC:
          </label>
          <input
            type="number"
            className="form-control"
            id="priceForPC"
            value={priceForPC}
            onChange={(e) => setPriceForPC(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="priceForBox" className="form-label">
            Price for Box:
          </label>
          <input
            type="number"
            className="form-control"
            id="priceForBox"
            value={priceForBox}
            onChange={(e) => setPriceForBox(Number(e.target.value))}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? "Update Product" : "Add Product"}
        </button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <h1>Products</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price for PC</th>
            <th>Price for Box</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.priceForPC}</td>
              <td>{product.priceForBox}</td>
              <td>
                <button
                  className="btn btn-info me-2"
                  onClick={() => handleEdit(product._id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductForm;
