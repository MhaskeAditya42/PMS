const Login = require('../models/loginModel');

exports.loginUser = (req, res) => {
  const { username, email, password_hash } = req.body;
  if (!username || !email || !password_hash) {
    return res.status(400).json({ error: 'Missing required fields: username, email, password_hash' });
  }
  Login.authenticateUser(username, email, password_hash, (err, user_id) => {
    if (err) return res.status(500).json({ error: err });
    if (!user_id) return res.status(401).json({ error: 'Invalid credentials' });
    res.status(200).json({ message: 'Login successful', user_id });
  });
};