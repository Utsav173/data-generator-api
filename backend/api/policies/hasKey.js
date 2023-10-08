module.exports = async function (req, res, next) {
  const apiKey = req.headers['api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized' }); // Unauthorized
  }

  // Verify API Key (You will need to implement this function)
  const isValid = await User.findOne({ apiKey: apiKey });

  if (!isValid) {
    return res.status(403).json({ error: 'Forbidden' }); // Forbidden
  }

  if (isValid.total === 1) {
    return res.status(403).json({ message: 'You have reached the limit' });
  }
  req.id = isValid.id;
  next();
};
