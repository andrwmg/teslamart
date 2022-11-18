const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Comment = require('./comment.model');

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

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