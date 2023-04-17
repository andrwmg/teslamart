const db = require('../models/index.js')
const Comment = db.comments
const Listing = db.listings

exports.create = async (req, res) => {
  const { id } = req.params
  const listing = await Listing.findById(id)
  const comment = new Comment(req.body)
  comment.author = req.session.user._id
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
    })
}

exports.reply = async (req, res) => {
  const { commentId } = req.params
  const comment = await Comment.findById(commentId)
  const reply = new Comment(req.body)
  reply.author = req.session.user._id
  comment.replies.unshift(reply)
  await reply.save()
  await comment.save()
  await Comment.findById(commentId)
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
      }
    })
    .then((data) => {
      res.send(data)
    })
}

exports.findAll = (req, res) => {

}

exports.findOne = async (req, res) => {
  const { commentId } = req.params
  await Comment.findById(commentId)
    .populate({
      path: 'replies',
      populate: {
        path: 'author'
      }
    })
    .then((data) => {
      res.send(data)
    })
}

exports.update = (req, res) => {

}

exports.delete = async (req, res) => {
  const { id, commentId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { comments: commentId } })
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

exports.deleteAll = (req, res) => {

}