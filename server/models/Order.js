import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  shippingAddress: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'Cambodia',
    },
    phone: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal', 'Cash on Delivery', 'KHQR'],
    default: 'Cash on Delivery',
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  // KHQR Payment Fields
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'expired'],
    default: 'pending',
  },
  khqrMd5: {
    type: String,
    // MD5 hash returned from KHQR generation - needed for payment verification
  },
  khqrFullHash: {
    type: String,
    // Alternative hash for payment verification (optional)
  },
  khqrExpiresAt: {
    type: Date,
    // When the QR code expires
  },
  khqrMeta: {
    // Store KHQR-specific metadata
    currency: {
      type: String,
      default: 'KHR',
    },
    amount: Number,
    billNumber: String,
    storeLabel: String,
    terminalLabel: String,
    merchantName: String,
    merchantCity: String,
    qrString: String, // The actual QR data string
    lastCheckedAt: Date, // Last time we checked payment status
    checkCount: {
      type: Number,
      default: 0,
    },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ khqrMd5: 1 });
orderSchema.index({ khqrExpiresAt: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual to check if KHQR is expired
orderSchema.virtual('isKhqrExpired').get(function() {
  if (!this.khqrExpiresAt) return false;
  return new Date() > this.khqrExpiresAt;
});

// Method to mark payment as paid
orderSchema.methods.markAsPaid = function() {
  this.isPaid = true;
  this.paidAt = Date.now();
  this.paymentStatus = 'paid';
  return this.save();
};

// Method to mark KHQR as expired
orderSchema.methods.markKhqrExpired = function() {
  this.paymentStatus = 'expired';
  return this.save();
};

// Method to update KHQR check metadata
orderSchema.methods.updateKhqrCheck = function() {
  if (!this.khqrMeta) this.khqrMeta = {};
  this.khqrMeta.lastCheckedAt = Date.now();
  this.khqrMeta.checkCount = (this.khqrMeta.checkCount || 0) + 1;
  return this.save();
};

export default mongoose.model('Order', orderSchema);