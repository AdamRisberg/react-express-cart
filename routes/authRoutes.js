const router = require("express").Router();
const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/admin_login", authController.adminLogin);
router.get("/logout", authController.logout);
router.get("/admin_logout", authController.adminLogout);

module.exports = router;
