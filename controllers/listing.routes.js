const router = require('express').Router();
const Listing = require('../models/Listing');
const Car = require('../models/Car');
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    
    let carId = req.body.car;

    
    if (!carId && req.body.carDetails) {
      const createdCar = await Car.create(req.body.carDetails);
      carId = createdCar._id;
    }

    const listing = await Listing.create({
      title: req.body.title,
      price: req.body.price,
      seller: payload._id,
      car: carId,
      condition: req.body.condition,
      location: req.body.location,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ isActive: true })
      .populate('car')
      .populate('seller', 'username')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('car').populate('seller', 'username');
    if (!listing) return res.status(404).json({ err: 'Listing not found' });

    
    let isOwner = false;
    try {
      const auth = req.headers.authorization;
      if (auth) {
        const parts = auth.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          const token = parts[1];
          const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
          const userId = decoded.payload && decoded.payload._id;
          if (userId) {
            isOwner = String(listing.seller && (listing.seller._id ? listing.seller._id : listing.seller)) === String(userId);
          }
        }
      }
    } catch (e) {
      
    }

    const result = listing.toObject();
    result.isOwner = isOwner;
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ err: 'Listing not found' });
    if (listing.seller.toString() !== payload._id) return res.status(403).json({ err: 'Not authorized' });

    
    if (req.body.carDetails && listing.car) {
      await Car.findByIdAndUpdate(listing.car, req.body.carDetails);
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ err: 'Listing not found' });
    if (listing.seller.toString() !== payload._id) return res.status(403).json({ err: 'Not authorized' });

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
