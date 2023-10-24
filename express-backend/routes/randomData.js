const express = require("express");
const router = express.Router();
const { generateRandomDataForStructure } = require("../utils/index");
const GeneratedData = require("../models/GeneratedData"); // Assuming you have a GeneratedData model
const { hasApiKey } = require("../middlewares");
const User = require("../models/User");
// Route: /randomData/generateRandomData
router.post("/api/generate/data", hasApiKey, async (req, res) => {
  const { structure, arrayLength } = req.body;

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
router.get("/user/supportedTypes", hasApiKey, async (req, res) => {
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

router.get("/v1/test", (req, res) => {
  try {
    const impurl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
    return res.json({
      message: "success",
      data: {
        coreImportance: {
          coreImportance: "coreImportance",
          coreImportance: impurl,
        },
      },
    });
  } catch (error) {
    return;
  }
});

module.exports = router;
