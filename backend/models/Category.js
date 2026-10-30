const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    public_id: String,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
}, { timestamps: true });

// Auto-generate slug before saving
categorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  next();
});

module.exports = mongoose.model('Category', categorySchema);
