// Importing thing we need
const express = require("express");
const apiController = require("../controller/apiController");
// Creating router
const router = express.Router();
// Routes
router.get("/", apiController.sendHTML);
router.get("/api/createnews", apiController.createNews);
router.get("/api/getnews", apiController.getNews);
// Exporting router
module.exports = router;