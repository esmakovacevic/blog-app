const express = require("express");
const router = express.Router();

const { getPosts, updatePost, deletePost, createPost } = require("../controllers/posts");
const multer = require("multer");
const { authenticateToken } = require("../../../middleware");
const uploadPhoto = multer().single("photo");
const upload = multer().single("file");


router.get("/select", authenticateToken, getPosts);
router.put("/update", authenticateToken,uploadPhoto, updatePost);
router.delete("/:id", authenticateToken,deletePost);
router.post("/form",authenticateToken, upload,createPost);

module.exports = router;
