const express = require("express");
const router = express.Router();
const { generateRandomDataForStructure } = require("../utils/index");
const { ObjectId } = require("mongodb");
const GeneratedData = require("../models/GeneratedData"); // Assuming you have a GeneratedData model
const { hasApiKey } = require("../middlewares");
const User = require("../models/User");
// Route: /randomData/generateRandomData
router.post("/api/generate/data", [hasApiKey], async (req, res) => {
  const { structure, arrayLength } = req.body;
  console.log("this called");
  if (!structure || !arrayLength) {
    return res
      .status(400)
      .json({ message: "Structure and arrayLength are required" });
  }

  try {
    const randomData = await Promise.all(
      Array.from({ length: parseInt(arrayLength) }, () =>
        generateRandomDataForStructure(structure)
      )
    );

    await GeneratedData.create({
      data: JSON.stringify(randomData),
      user: req.id,
    });
    await User.findByIdAndUpdate(req.id, { $inc: { total: -1 } });

    return res.json(randomData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
  2;
});

// Route: /randomData/getSupportedTypes
router.get("/user/supportedTypes", [hasApiKey], async (req, res) => {
  try {
    const types = [
      "string",
      "number",
      "arrayOfArray",
      "arrayOfString",
      "arrayOfNumber",
      "boolean",
      "uuid",
      "date",
      "email",
      "address",
      "name",
      "fullName",
      "slug",
      "longText",
      "website",
      "ip",
      "contact",
    ];

    return res.json(types);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
