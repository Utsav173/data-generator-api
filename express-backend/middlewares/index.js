const User = require("../models/User"); // Assuming the path to your User model

const hasApiKey = async (req, res, next) => {
  const apiKey = req.headers["api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const isValid = await User.findOne({ apiKey });

    if (!isValid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (isValid.total === 1) {
      return res.status(403).json({ message: "You have reached the limit" });
    }

    req.id = isValid.id;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const isAdmin = (req, res, next) => {
  const apiKey = req.headers["api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (apiKey === process.env.ADMIN_KEY) {
    return next();
  }

  return res.status(403).json({ error: "Forbidden" });
};

module.exports = { isAdmin, hasApiKey };
