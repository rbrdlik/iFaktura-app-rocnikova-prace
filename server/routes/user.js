const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload")

router.get("/", auth, userController.getUser)
router.post("/login", userController.login);
router.post("/register", userController.register);
router.put("/:id", auth, upload.fields([ {name: "profilePicture", maxCount: 1}, {name: "invoiceLogo", maxCount: 1} ]), userController.updateUser)
router.post("/verifyPassword", auth, userController.verifyPassword)
router.delete("/:id", auth, userController.deleteUser)

module.exports = router;