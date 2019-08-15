const router = require("express").Router();
const adminController = require("../controllers/admin");
const {
  authorizeAdmin,
  userIsAdmin,
  userHasEditPermission
} = require("../middleware");

router.use(authorizeAdmin);
router.use(userIsAdmin);
router.get("/", adminController.getAll);
router.get("/:id", adminController.getOne);
router.use(userHasEditPermission);
router.put("/:id", adminController.update);
router.post("/delete", adminController.remove);
router.post("/", adminController.add);

module.exports = router;
