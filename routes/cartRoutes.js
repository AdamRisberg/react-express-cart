const router = require("express").Router();
const cartController = require("../controllers/cart");

router.post("/add", cartController.add);
router.get("/:id", cartController.get);
router.post("/remove", cartController.remove);
router.post("/clear", cartController.clear);

module.exports = router;
