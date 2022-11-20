const listings = require("../controllers/listing.controller.js");
const router = require("express").Router();
const {isLoggedIn, isAuthor} = require('../../middleware')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

// Create a new Tutorial
router.post("/", isLoggedIn, listings.create);

// // Retrieve all Tutorials
router.get("/", listings.findAll);

// // Retrieve all published Tutorials
// router.get("/published", listings.findAllPublished);

// // Retrieve a single Tutorial with id
router.get("/:id", listings.findOne);

// // Update a Tutorial with id
router.put("/:id", isLoggedIn, isAuthor, listings.update);

// // Delete a Tutorial with id
router.delete("/:id", isLoggedIn, isAuthor, listings.delete);

module.exports = router