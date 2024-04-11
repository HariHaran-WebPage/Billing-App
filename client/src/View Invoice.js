import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PDFViewer,
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import "./ShowProduct.css";

const CustomerDetails = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [customerInfoList, setCustomerInfoList] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [billDetails, setBillDetails] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0); // State to store the paid amount

  useEffect(() => {
    fetchProducts();
    fetchCustomerInfo();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/allproduct");
      const productsData = response.data; // Assuming response.data is an array of products
      setProducts(productsData);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching products");
    }
  };

  const fetchCustomerInfo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Storeall");
      const customersData = response.data; // Assuming response.data is an array of customer info
      setCustomerInfoList(customersData);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching customer info");
    }
  };

  useEffect(() => {
    if (products.length > 0 && customerInfoList.length > 0) {
      initializeCustomerData(products);
    }
  }, [products, customerInfoList]);

  const initializeCustomerData = (products) => {
    const initialData = customerInfoList.map(() => ({
      productQuantities: products.map(() => ({
        quantityType: "PC",
        quantity: 0, // Change initial quantity to 0
      })),
      totalPrices: products.map(() => 0),
    }));
    setCustomerData(initialData);
  };

  const handleQuantityTypeChange = (e, customerIndex, productIndex) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].productQuantities[productIndex].quantityType =
      e.target.value;
    setCustomerData(updatedData);
    updateTotalPrice(updatedData[customerIndex], productIndex);
  };

  const handleQuantityChange = (e, customerIndex, productIndex) => {
    const updatedData = [...customerData];
    const inputValue = e.target.value;

    // Check if the input is a valid number greater than or equal to 0
    if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
      if (!updatedData[customerIndex]) {
        updatedData[customerIndex] = {
          productQuantities: products.map(() => ({
            quantityType: "PC",
            quantity: 0, // Change initial quantity to 0
          })),
          totalPrices: products.map(() => 0),
        };
      }
      updatedData[customerIndex].productQuantities[productIndex].quantity =
        parseInt(inputValue);
      setCustomerData(updatedData);
      updateTotalPrice(updatedData[customerIndex], productIndex);
    }
  };

  const calculateBillAmount = (product, quantity, quantityType) => {
    if (!product || !quantity || isNaN(quantity) || !quantityType) {
      return 0;
    }

    let price = 0;
    if (quantityType === "PC" && product.priceForPC) {
      price = product.priceForPC;
    } else if (quantityType === "Box" && product.priceForBox) {
      price = product.priceForBox;
    }

    return price * quantity;
  };

  const updateTotalPrice = (customer, productIndex) => {
    const { productQuantities } = customer;
    const { quantity, quantityType } = productQuantities[productIndex];
    const selectedProduct = products[productIndex];
    const totalPrice = calculateBillAmount(
      selectedProduct,
      quantity,
      quantityType
    );
    const updatedData = [...customerData];
    updatedData[updatedData.indexOf(customer)].totalPrices[productIndex] =
      totalPrice;
    setCustomerData(updatedData);
  };

  const calculateTotal = (customerIndex) => {
    if (customerData[customerIndex]?.totalPrices) {
      return customerData[customerIndex].totalPrices.reduce(
        (total, price) => total + price,
        0
      );
    }
    return 0;
  };

  const handleCreateBill = (customerIndex) => {
    const customer = customerInfoList[customerIndex];
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    // Increment the invoice number based on the number of existing bills
    const invoiceNo = ("0000" + (customerIndex + 1)).slice(-4);

    // Calculate total amount
    const totalAmount = calculateTotal(customerIndex);

    // Calculate balance
    const balance = totalAmount - paidAmount;

    // Generate bill content
    const billContent = `
      App X-20
      (Address here)
      Name: ${customer.name}    Shop Name: ${
      customer.shopName
    }                            
      Invoice No: ${invoiceNo}
      Date: ${formattedDate}

      No : Product Name Qty Type QTY Total Amount
      ${customerData[customerIndex].productQuantities
        .map(
          (product, index) => `
      ${index + 1} ${products[index]?.name} ${product.quantityType} ${
            product.quantity
          } ${customerData[customerIndex]?.totalPrices[index] || ""}
      `
        )
        .join("")}

      Total Bill: ${totalAmount}    Paid Amount: ${paidAmount}       Balance RS: ${balance}
    `;
    setBillDetails(billContent);
  };

  const savePDF = () => {
    if (billDetails) {
      const pdfContent = generatePDFContent();
      pdf(pdfContent)
        .toBlob()
        .then((blob) => {
          saveAs(blob, "bill_details.pdf");
        });
    }
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: "center",
    },
    content: {
      fontSize: 12,
      textAlign: "left",
    },
  });

  const generatePDFContent = () => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Bill Details</Text>
            <Text style={styles.content}>{billDetails}</Text>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <div className="container">
      <h1>Customer Information</h1>
      {customerInfoList.map((customer, customerIndex) => (
        <div key={customerIndex}>
          <h2>Customer Name: {customer.name}</h2>
          <h3>Shop Name: {customer.shopName}</h3>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>No</th>
                <th>Product Name</th>
                <th>Price (PC)</th>
                <th>Price (Box)</th>
                <th>Quantity Type</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, productIndex) => (
                <tr key={productIndex}>
                  <td>{productIndex + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.priceForPC || "-"}</td>
                  <td>{product.priceForBox || "-"}</td>
                  <td>
                    <select
                      className="form-control"
                      value={
                        customerData[customerIndex]?.productQuantities[
                          productIndex
                        ]?.quantityType || ""
                      }
                      onChange={(e) =>
                        handleQuantityTypeChange(e, customerIndex, productIndex)
                      }
                    >
                      <option value="PC">PC</option>
                      <option value="Box">Box</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={
                        customerData[customerIndex]?.productQuantities[
                          productIndex
                        ]?.quantity >= 0 // Check if quantity is defined and greater than or equal to 0
                          ? customerData[customerIndex]?.productQuantities[
                              productIndex
                            ]?.quantity // Use the quantity if defined and >= 0
                          : 0 // Otherwise, default to 0
                      }
                      min="0"
                      onChange={(e) =>
                        handleQuantityChange(e, customerIndex, productIndex)
                      }
                    />
                  </td>
                  <td>
                    $
                    {customerData[customerIndex]?.totalPrices[productIndex] ||
                      0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn btn-primary"
            onClick={() => handleCreateBill(customerIndex)}
          >
            Create Bill
          </button>
          {billDetails && (
            <div className="bill-details">
              <h2 className="mb-4">Bill Details</h2>
              <pre className="bill-content">{billDetails}</pre>
              <div className="form-group mt-4">
                <label htmlFor="paidAmount">Paid Amount:</label>
                <input
                  type="number"
                  id="paidAmount"
                  className="form-control"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseInt(e.target.value))}
                />
              </div>
              <button className="btn btn-primary" onClick={savePDF}>
                Save as PDF
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setBillDetails(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerDetails;
