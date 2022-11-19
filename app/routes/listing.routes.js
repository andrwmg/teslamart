const listings = require("../controllers/listing.controller.js");
const router = require("express").Router();
const {isLoggedIn, isAuthor} = require('../../middleware')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

// Create a new Tutorial
router.post("/", upload.single('image'), listings.create);

// // Retrieve all Tutorials
router.get("/", listings.findAll);

// // Retrieve all published Tutorials
// router.get("/published", listings.findAllPublished);

// // Retrieve a single Tutorial with id
router.get("/:id", listings.findOne);

// // Update a Tutorial with id
router.put("/:id",listings.update);

// // Delete a Tutorial with id
router.delete("/:id", listings.delete);

module.exports = router