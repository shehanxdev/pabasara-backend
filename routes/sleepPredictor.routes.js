const express = require("express");
const { sleepPredictor } = require("../controllers/sleepPredictor.controller");
const router = express.Router();

router.post("/predict", sleepPredictor);

module.exports = router;
