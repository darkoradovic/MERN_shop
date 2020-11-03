const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoDb = require("./config/db");
const colors = require("colors");
const product = require("./routes/product");
const user = require("./routes/users");
const order = require("./routes/orders");
const uploads = require("./routes/uploads");

const { errorHandler, notFound } = require("./midleware/errorMidleware");

dotenv.config();

mongoDb();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API runing...");
});

app.use("/api/products", product);
app.use("/api/users", user);
app.use("/api/orders", order);
app.use("/api/upload", uploads);

app.get("/api/config/paypal", (req, res) => {
  return res.send(process.env.PAYPAL_CLIENT_ID);
});

//const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server runing in ${process.env.NODE_ENV} mode on port: ${PORT}`.brightBlue
  )
);
