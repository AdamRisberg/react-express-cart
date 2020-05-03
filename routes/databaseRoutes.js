const router = require("express").Router();
const databaseController = require("../controllers/database");
const {
  authorizeAdmin,
  userHasEditPermission,
  userIsAdmin,
} = require("../middleware");

router.use(authorizeAdmin);
router.use(userIsAdmin);
router.use(userHasEditPermission);
router.get("/", databaseController.get);
router.post("/", databaseController.post);

module.exports = router;
