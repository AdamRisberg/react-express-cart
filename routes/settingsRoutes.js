const router = require("express").Router();
const settingsController = require("../controllers/settings");
const {
  authorizeAdmin,
  userHasEditPermission,
  userIsAdmin
} = require("../middleware");

router.get("/general", settingsController.getGeneral);
router.use(authorizeAdmin);
router.use(userIsAdmin);
router.get("/", settingsController.get);
router.use(userHasEditPermission);
router.put("/", settingsController.update);
router.put("/image", settingsController.addImage);
router.delete("/image", settingsController.deleteImage);

module.exports = router;
