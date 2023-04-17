const mongoose = require('mongoose');
const Comment = require('./comment.model');

// const opts = { toJSON: {virtuals:true}};
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
})

// ImageSchema.virtual('thumbnail').get(function(){
//     return this.url.replace("/upload", "/upload/w_200")
// })

const ListingSchema = new Schema ({
    images: [ImageSchema],
    year: Number,
    model: {
        type: String,
        enum: ['Model S', 'Model 3', 'Model X', 'Model Y'],
        required: true
    },
    trim: {type: String,
    require: true},
    mileage: {type: Number,
        required: true},
    exterior: {
        type: String,
        enum: ['Black','White','Gray','Blue','Red'],
        required: true
    },
    interior: {
        type: String,
        enum: ['Black','White','Cream'],
        required: true
    },
    autopilot: {
        type: String,
        enum: ['None','Autopilot','Enhanced Autopilot','Full Self-Driving'],
        required: true
    },
    condition: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair'],
        required: true
    },
    title: {
        type: String,
        enum: ["Clean", "Salvage", "Rebuilt"],
        required: true
    },
    price: {type: Number,
        required: true},
    description: String,
    location: {type: String,
        required: true},
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
       type: Schema.Types.ObjectId,
       ref: 'Comment'
    }],
},    
{timestamps: true} 
// ,opts
)

ListingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.remove({
            _id: {
                $in: doc.comments 
            }
        })
    }
})


module.exports = mongoose.model('Listing', ListingSchema)
