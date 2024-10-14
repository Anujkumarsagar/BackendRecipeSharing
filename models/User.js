const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    profilePic: {
        type: Object,
        default: null
    },
    contactNumber: {
        type: String,
        default: ""
    },
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ],
    favoriteRecipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    accountType: {
        type: String,
        enum: ["visitor", "creator"],
        default: "visitor"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
    }
}, { timestamps: true })

// Pre-save hook to handle Cloudinary image object
UserSchema.pre('save', function (next) {
    if (this.profilePic && typeof this.profilePic === 'object') {
        this.profilePic = {
            public_id: this.profilePic.public_id,
            url: this.profilePic.secure_url
        };
    }
    next();
});

//how can i validate an email address is valid or not
UserSchema.path('email').validate(function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}, 'Invalid email address');


module.exports = mongoose.model('User', UserSchema)