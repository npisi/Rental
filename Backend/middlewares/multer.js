const multer = require("multer");

const storage = multer.memoryStorage();

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP, GIF, or AVIF images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
});

// Helpers for routes (optional, for clarity)
const uploadProfileAndGallery = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

module.exports = {
  upload,
  uploadProfileAndGallery, // handy for property routes
};