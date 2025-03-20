const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const auth = require("../middlewares/auth");

router.get("/", auth, productController.getAllUserProduct)
router.get("/:id", auth, productController.getUserProductById)
router.post("/", auth, productController.createProduct)
router.put("/:id", auth, productController.updateProduct)
router.delete("/:id", auth, productController.deleteProduct)

module.exports = router;