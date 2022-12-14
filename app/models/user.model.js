const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Comment = require('./comment.model');
const Listing = require('../models/listing.model')

const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
})

const MessageSchema = new Schema ({
    to: { 
        type: Schema.Types.ObjectId,
        ref: 'User'},
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    read: false
},{timestamps: true})

const UserSchema = new Schema ({
    image: ImageSchema,
    email: {
        type: String,
        required: true,
        unique: true
    },
    inbox: [MessageSchema],
    outbox: [MessageSchema]
    // favorites: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Listing'
    //  }]
    },{timestamps: true} 
)

UserSchema.plugin(passportLocalMongoose);

UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.remove({
            _id: {
                $in: doc.comments 
            }
        })
    }
})

module.exports = mongoose.model('User', UserSchema)