const router = require("express").Router();
const footerController = require("../controllers/footer");

router.get("/links", footerController.getFooterLinks);

module.exports = router;
