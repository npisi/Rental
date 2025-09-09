const express = require("express");
const { uploadProfileAndGallery } = require("../middlewares/multer")
const {
  getProperty,
  getSingleProperty,
  listProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const propertyAuth = require("../middlewares/propertyAuth");

const router = express.Router();

router.get("/properties", getProperty);
router.get("/properties/:id", getSingleProperty);
router.post("/properties", propertyAuth, uploadProfileAndGallery, listProperty);
router.patch("/properties/:id", propertyAuth,uploadProfileAndGallery, updateProperty);
router.delete("/properties/:id", propertyAuth, deleteProperty);

module.exports = router;
