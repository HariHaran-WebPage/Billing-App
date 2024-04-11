const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
const StaffDashbordPage = require("./Route/StaffRoute");
const LoginPage = require("./Route/LoginRoute");
const AddproductPage = require("./Route/AddproductRoute");
const BillingPage = require("./Route/CreateBillRoute");
const CustomerPage = require("./Route/CustomerRoute");
const AdminPage = require("./Route/AdminRoute");

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});
app.use(cors());
app.use(bodyParser.json());
app.use("/", StaffDashbordPage);
app.use("/", LoginPage);
app.use("/", AddproductPage);
app.use("/", BillingPage);
app.use("/", CustomerPage);
app.use("/", AdminPage);

mongoose
  .connect("mongodb://0.0.0.0:27017", {
    dbName: "Billingapp",
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
