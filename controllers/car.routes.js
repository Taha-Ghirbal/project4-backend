const router = require('express').Router();
const Car = require('../models/Car');
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const cars = await Car.find({}).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ err: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ err: 'Car not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Car.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ err: 'Car not found' });
    res.json({ msg: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
