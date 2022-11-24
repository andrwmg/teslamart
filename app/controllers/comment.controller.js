const db = require('../models/index.js')
const Comment = db.comments
const Listing = db.listings
// const { cloudinary } = require('../cloudinary')

exports.create = async (req,res) => {
  const {id} = req.params
    const listing = await Listing.findById(id)
    const comment = new Comment(req.body)
    comment.author = req.user._id
    listing.comments.unshift(comment)
    await comment.save()
    await listing.save()
    await Listing.findById(id)
    .populate({
        path: 'comments',
        populate: {
          path: 'author'
        }
      })
    .then(data => {
        res.send(data)
    })}

exports.findAll = (req,res) => {

}

exports.findOne = (req,res) => {
    
}

exports.update = (req,res) => {
    
}

exports.delete = async (req,res) => {
    const {id, commentId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(commentId);
    await Listing.findById(id)
    .populate({
        path: 'comments',
        populate: {
          path: 'author'
        }
      })
    .then(data => {
        res.send(data)
    })
}

exports.deleteAll = (req,res) => {
    
}