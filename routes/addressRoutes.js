const router = require("express").Router();
const addressController = require("../controllers/addresses");
const {
  authorizeCustomer,
  authorizeAdmin,
  userExists
} = require("../middleware");

router.use(authorizeCustomer);
router.use(authorizeAdmin);
router.use(userExists);
router.post("/", addressController.add);
router.put("/", addressController.update);
router.post("/remove", addressController.remove);

module.exports = router;
