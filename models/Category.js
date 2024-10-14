const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  image: {
    type: Object,
    default: null
  },
  popularity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to auto-generate slug if not provided
categorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  // Handle Cloudinary image object
  if (this.image && typeof this.image === 'object') {
    this.image = {
      public_id: this.image.public_id,
      url: this.image.secure_url
    };
  }

  next();
});

// Added comment: Define virtual field for recipe count
categorySchema.virtual('recipeCount', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'category',
  count: true
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
