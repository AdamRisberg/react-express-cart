const router = require("express").Router();
const pageController = require("../controllers/page");
const {
  authorizeAdmin,
  userIsAdmin,
  userHasEditPermission
} = require("../middleware");

router.get("/path/:path", pageController.getPageByPath);
router.use(authorizeAdmin);
router.use(userIsAdmin);
router.get("/", pageController.getAll);
router.get("/:id", pageController.getPage);
router.use(userHasEditPermission);
router.post("/delete", pageController.remove);
router.post("/", pageController.add);
router.put("/:id", pageController.update);

module.exports = router;
