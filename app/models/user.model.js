const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Comment = require('./comment.model');
const Listing = require('../models/listing.model')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

const MessageSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    read: {type: Boolean,
        default: false
    }
}, { timestamps: true })

const UserSchema = new Schema({
    image: ImageSchema,
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    username_lower: {
        type: String,
        lowercase: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    inbox: [MessageSchema],
    outbox: [MessageSchema]
    // favorites: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Listing'
    //  }]
}, { timestamps: true }
)

UserSchema.methods.generateLower = function() {
    try {
        this.username_lower = this.username.toLowerCase()
    } catch (error) {
        next(error);
    }
}

UserSchema.methods.hashPassword = async function () {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    } catch (error) {
        next(error);
    }
}

UserSchema.methods.generateVerificationToken = function () {
    this.verificationToken = Math.random().toString(36).slice(-10);
    return this.verificationToken;
};

UserSchema.methods.generateResetToken = function () {
    this.resetPasswordToken = Math.random().toString(36).slice(-10);
    this.resetPasswordExpires = Date.now() + 3600000;
    return this.resetPasswordToken;
};

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