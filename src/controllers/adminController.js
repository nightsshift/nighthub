const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/env');

const ADMIN_USERNAME = 'EKandMC';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('0911865383Fikir', 10);

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username !== ADMIN_USERNAME || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verify = (req, res) => {
  res.status(200).json({ valid: true });
};