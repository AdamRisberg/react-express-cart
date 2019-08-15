const router = require("express").Router();
const checkoutController = require("../controllers/checkout");

router.post("/", checkoutController.createOrder);
router.post("/shipping", checkoutController.getShippingMethods);

module.exports = router;
