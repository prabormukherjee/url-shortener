const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const ENV = require("./util/env-config");

const MONGODB_URI = ENV.MONGODB_URI;
const PORT = ENV.PORT;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const urlRoutes = require("./routes/urls");

const errorcontroller = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(urlRoutes);

app.get("/500", errorcontroller.get500);
app.use(errorcontroller.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "",
  });
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("Connected to DataBase");
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
