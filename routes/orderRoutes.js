const router = require("express").Router();
const orderController = require("../controllers/orders");
const {
  authorizeAdmin,
  authorizeCustomer,
  userExists,
  userIsAdmin,
  userHasEditPermission
} = require("../middleware");

router.use(authorizeCustomer);
router.use(authorizeAdmin);
router.use(userExists);
router.get("/years/:userID", orderController.getOrdersYears);
router.get("/all/:userID", orderController.getCustomerOrders);
router.get("/analytics", userIsAdmin, orderController.getOrderAnalytics);
router.get("/all", userIsAdmin, orderController.getAllOrders);
router.get("/:orderID", orderController.getOneOrder);
router.use(userIsAdmin);
router.use(userHasEditPermission);
router.post("/delete", orderController.remove);
router.post("/", orderController.add);
router.post("/history/:orderID", orderController.addHistory);
router.put("/:id", orderController.update);

module.exports = router;
