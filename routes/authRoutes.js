const express = require("express");
const router = express.Router();
const { auth, register, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");


router.route("/me").get(protect,me)
router.route("/login").post(auth)
router.route("/register").post(register);

module.exports = router;