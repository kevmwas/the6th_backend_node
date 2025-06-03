const createError = require("http-errors");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sequelize = require("./config/db");
const routes = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/v1/files", express.static(path.join(__dirname, "../uploads")));
app.use(compression());
app.disable("x-powered-by");
app.use((req, res, next) => {
  // TODO enable access control cors
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  res.header("X-Frame-Options", "DENY"); // if its required to change, update it to SAMEORIGIN and retest
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELETE");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  res.header("X-DNS-Prefetch-Control", "Off");
  res.header("X-Download-Options", "noopen");
  res.header(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  return next();
});
app.use(cookieParser());

// v1 api routes
app.use("/v1", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database", error);
  });

module.exports = app;
