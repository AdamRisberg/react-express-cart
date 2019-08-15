const router = require("express").Router();
const productController = require("../controllers/products");
const {
  authorizeAdmin,
  userIsAdmin,
  userHasEditPermission
} = require("../middleware");

router.get("/featured", productController.getFeatured);
router.get("/category", productController.getByCategory);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.use(authorizeAdmin);
router.use(userIsAdmin);
router.use(userHasEditPermission);
router.put("/:id/image", productController.addImage);
router.delete("/:id/image", productController.deleteImage);
router.put("/:id", productController.update);
router.post("/delete", productController.deleteProducts);
router.post("/", productController.insert);

module.exports = router;
