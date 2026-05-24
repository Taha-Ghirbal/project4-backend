const router = require('express').Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    const { listing: listingId, when, message } = req.body;

    
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ err: 'Listing not found' });

    const booking = await Booking.create({ listing: listingId, user: payload._id, when, message });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    const bookings = await Booking.find({ user: payload._id }).populate('listing').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    const booking = await Booking.findById(req.params.id).populate('listing');
    if (!booking) return res.status(404).json({ err: 'Booking not found' });
    if (String(booking.user) !== payload._id) return res.status(403).json({ err: 'Not authorized' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ err: 'Booking not found' });
    if (String(booking.user) !== payload._id) return res.status(403).json({ err: 'Not authorized' });

    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const payload = req.user;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ err: 'Booking not found' });
    if (String(booking.user) !== payload._id) return res.status(403).json({ err: 'Not authorized' });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
