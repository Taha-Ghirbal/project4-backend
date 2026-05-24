const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    mileage: { type: Number, default: 0 },
    color: { type: String, trim: true },
    vin: { type: String, trim: true, unique: false },
    description: { type: String, trim: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
