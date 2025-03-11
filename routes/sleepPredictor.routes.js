const express = require("express");
const {
  sleepPredictor,
  addSleepRecord,
  getAllSleepRecords,
} = require("../controllers/sleepPredictor.controller");
const router = express.Router();

router.post("/predict", sleepPredictor);
router.post("/addRecord", addSleepRecord);
router.get("/getRecords", getAllSleepRecords);

module.exports = router;
