const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ err: 'Missing Authorization header.' });

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ err: 'Malformed Authorization header.' });

    const token = parts[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyErr) {
      return res.status(401).json({ err: 'Invalid or expired token.' });
    }

  req.user = decoded.payload;

    next();
  } catch (err) {
  res.status(401).json({ err: 'Invalid token.' });
  }
}

module.exports = verifyToken;
