module.exports = async function (req, res, next) {
  const apiKey = req.headers['api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized' }); // Unauthorized
  }

  // Verify API Key (You will need to implement this function)
  if (apiKey === process.env.ADMIN_KEY) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' }); // Forbidden
};
