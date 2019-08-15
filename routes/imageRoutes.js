const router = require("express").Router();
const imageController = require("../controllers/image");
const {
  authorizeAdmin,
  userIsAdmin,
  userHasEditPermission
} = require("../middleware");

router.use(authorizeAdmin);
router.use(userIsAdmin);
router.get("/", imageController.getImages);
router.use(userHasEditPermission);
router.post("/upload", imageController.upload);

module.exports = router;
