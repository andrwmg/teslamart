const Listing = require("./app/models/listing.model");
const Comment = require("./app/models/comment.model");
const passport = require('passport')


module.exports.isLoggedIn = (req, res, next) => {
    console.log('isLoggedIn Middleware ' + req.user)

    console.log(req.isAuthenticated())
    if (!req.isAuthenticated()) {
        console.log("Sign in, bro!")
        res.send('You must be signed in!')
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    console.log('isAuthor Middleware ' + req.user)
    const { isAuthor } = req.body;
    // const listing = await Listing.findById(id).populate('author')
    if (!isAuthor) {
        console.log('You cant delete that, yo!')
        res.send('Seriously, do not do that!')
    } else {
    next()
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that")
        return res.redirect(`/listings/${id}`)
    }
    next()
}