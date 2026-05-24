const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const authRouter = require('./controllers/auth.routes');
const carRouter = require('./controllers/car.routes');
const listingRouter = require('./controllers/listing.routes');
const bookingRouter = require('./controllers/booking.routes');
const verifyToken = require('./middleware/verify-token');
if (!process.env.MONGODB_URI) {
  const path = require('path');
  const parentEnv = path.resolve(__dirname, '../.env');
  try {
    require('dotenv').config({ path: parentEnv });
  } catch (e) {
    
  }
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Please create a .env file with MONGODB_URI in the project root or backend/.env');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use('/auth', authRouter);
app.use('/api/cars', carRouter);
app.use('/api/listings', listingRouter);
app.use('/api/bookings', bookingRouter);


app.listen(3000, () => {
  console.log('The express app is ready!');
});
