const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require('body-parser')
const mongoDb = require("./config/db");
const colors = require("colors");
const product = require("./routes/product");

const { errorHandler, notFound } = require("./midleware/errorMidleware");

dotenv.config();

mongoDb();

const app = express();
app.use(bodyParser());

app.get("/", (req, res) => {
  res.send("API runing");
});

app.use("/api/products", product);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server runing in ${process.env.NODE_ENV} mode on port: ${PORT}`.brightBlue
  )
);
