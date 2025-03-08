const express = require("express");
const router = express.Router();
const {
  submitSurvay
} = require("../controllers/userController");



router.route("/submit_survay/:_id").post(submitSurvay);



// router.route("/placeOrder").post(placeOrder);
// router.route("/getShopByShopId").post(getShopByShopId);
// router.route("/getAllProducts").post(getAllProducts);
// router.route("/getProductbyShopId").post(getProductbyShopId);
// router.route("/getOrdersByUserId").post(getOrdersByUserId);
// router.route("/deleteOrder").post(deleteOrder);
// router.route("/searchProduct").get(searchProduct);



module.exports = router;