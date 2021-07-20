const express = require("express");

const urlController = require("../controllers/urls");

const Router = express.Router();

Router.get("/", urlController.getHome);

Router.post("/shorten", urlController.postShorten);

Router.get("/:redirect", urlController.getRedirct);

module.exports = Router;
