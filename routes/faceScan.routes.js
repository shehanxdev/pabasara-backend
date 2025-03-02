const express = require("express");
const multer = require("multer");
const path = require("path");

const faceScanRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

faceScanRouter.post("/scanFace", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);
  res.status(200).json({
    message: "Image uploaded successfully.",
    filePath: filePath,
  });
});

module.exports = faceScanRouter;
