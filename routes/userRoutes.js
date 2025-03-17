const express = require("express");
const router = express.Router();
const {
  submitSurvay
} = require("../controllers/userController");
const { predictBedtime, addToken } = require("../controllers/BedtimePredictController");



router.route("/submit_survay/:_id").post(submitSurvay);
router.route("/predict_bedtime/:_id/:stepCount").get(predictBedtime);
router.route("/token/:_id").post(addToken);




module.exports = router;