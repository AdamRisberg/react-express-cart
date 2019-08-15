const router = require("express").Router();
const categoryController = require("../controllers/categories");
const {
  authorizeAdmin,
  userIsAdmin,
  userHasEditPermission
} = require("../middleware");

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.use(authorizeAdmin);
router.use(userIsAdmin);
router.use(userHasEditPermission);
router.post("/delete", categoryController.remove);
router.put("/:id", categoryController.update);
router.post("/", categoryController.add);
router.put("/:id/image", categoryController.addImage);
router.delete("/:id/image", categoryController.deleteImage);

module.exports = router;
