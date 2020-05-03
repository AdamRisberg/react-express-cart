const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./database");

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/pages", require("./routes/pageRoutes"));
app.use("/api/footer", require("./routes/footerRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/shipping", require("./routes/shippingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/database", require("./routes/databaseRoutes"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(process.env.PORT, () => {
  console.log("Running on port: " + process.env.PORT);
});
