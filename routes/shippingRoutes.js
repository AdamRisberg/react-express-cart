const router = require("express").Router();
const shippingController = require("../controllers/shipping");
const {
  authorizeAdmin,
  userIsAdmin,
  userHasEditPermission
} = require("../middleware");

router.get("/active", shippingController.getActive);
router.use(authorizeAdmin);
router.use(userIsAdmin);
router.get("/", shippingController.getAll);
router.get("/:id", shippingController.getOne);
router.use(userHasEditPermission);
router.put("/:id", shippingController.update);
router.post("/delete", shippingController.remove);
router.post("/", shippingController.add);

module.exports = router;
