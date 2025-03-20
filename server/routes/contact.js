const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact");
const auth = require("../middlewares/auth");

router.get("/", auth, contactController.getAllUserContact)
router.get("/:id", auth, contactController.getUserContactById)
router.post("/", auth, contactController.createContact)
router.put("/:id", auth, contactController.updateContact)
router.delete("/:id", auth, contactController.deleteContact)

module.exports = router;