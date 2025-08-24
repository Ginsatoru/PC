import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'Motherboard', 'PSU', 'Case', 'Cooling', 'Monitor', 'Keyboard', 'Mouse'],
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: 0,
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  specifications: {
    type: Map,
    of: String,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=PC+Part',
  },
  images: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better search performance
productSchema.index({ name: 'text', brand: 'text', model: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });

export default mongoose.model('Product', productSchema);