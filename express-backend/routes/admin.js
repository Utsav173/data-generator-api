const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const { isAdmin } = require('../middlewares');

// Route: /admin/getUser
router.get('/users',[isAdmin], async (req, res) => {
  try {
    const userData = await User.find().sort({ createdAt: -1 });
    return res.json(userData);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Bad Request' });
  }
});

// Route: /admin/getUserData/:id
router.get('/user/:id',[isAdmin], async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const userData = await GeneratedData.find({ user: id }).sort({ createdAt: -1 });
    return res.json(userData);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Bad Request' });
  }
});

// Route: /admin/getSingleUserData/:id
router.get('/user/data/:id',[isAdmin], async (req, res) => {
  try {
    const id = req.params.id;
    const GenerationData = await GeneratedData.findOne({ id });

    if (!GenerationData) {
      return res.status(404).json({ message: 'Data not found' });
    }

    GenerationData.data = JSON.parse(GenerationData.data);

    return res.json(GenerationData);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Bad Request' });
  }
});

module.exports = router;
