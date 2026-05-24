const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    when: { type: Date, required: true },
    message: { type: String, trim: true },
    status: { type: String, enum: ['requested', 'confirmed', 'cancelled'], default: 'requested' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
