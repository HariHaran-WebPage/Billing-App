// src/components/ProductTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bills");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.serialNumber}</td>
            <td>{product.productName}</td>
            <td>{product.quantity}</td>
            <td>{product.unitPrice}</td>
            <td>{product.totalAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
