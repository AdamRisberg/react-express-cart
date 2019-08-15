const router = require("express").Router();
const customerController = require("../controllers/customers");
const {
  authorizeAdmin,
  userIsAdmin,
  authorizeCustomer,
  userExists,
  userHasEditPermission
} = require("../middleware");

router.use(authorizeCustomer);
router.use(authorizeAdmin);
router.use(userExists);
router.put("/name", customerController.updateName);
router.put("/email", customerController.updateEmail);
router.put("/password", customerController.updatePassword);
router.use(userIsAdmin);
router.get("/", customerController.getAll);
router.get("/:id", customerController.getOne);
router.use(userHasEditPermission);
router.post("/delete", customerController.remove);
router.put("/:id", customerController.update);

module.exports = router;
