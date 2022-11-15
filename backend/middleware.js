const Listing = require("./app/models/listing.model");
const Comment = require("./app/models/comment.model");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        // req.flash('error', 'You must be signed in!')
        // return res.redirect('/login')
        console.log(req.user)
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that")
        return res.redirect(`/listings/${id}`)
    }
    next()
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