const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose.set('strictQuery', true);
db.url = dbConfig.url;
db.listings = require("./listing.model.js");
db.users = require("./user.model.js");
db.comments = require("./comment.model.js");
db.images = require("./image.model.js");

module.exports = db;