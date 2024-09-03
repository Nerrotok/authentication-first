const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const mongoose = require("mongoose");
// import routs
const getUser = require("./routes/getUser");
const getDivRepo = require("./routes/getDivRepo");
const cors = require("cors");

// Middleware set-up
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));

// uri
const uri =
  "mongodb+srv://connor:$Np8E7NCuLk2_gn@hyperion-stuff-1324.n5sd7.mongodb.net/?retryWrites=true&w=majority&appName=hyperion-stuff-1324";

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(uri, { useNewUrlParser: true }).then(
  () => {
    console.log("Successfully connected to the database!");
  },
  (err) => {
    console.log("Could not connect to the database..." + err);
  }
);

// set routes to be handled by server : http://localhost:8080
app.use("/user", getUser);
app.use("/divrepos", getDivRepo);

// Host express server
app.listen(port, () =>
  console.log(`Now listening at http://localhost:${port}`)
);
