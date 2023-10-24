const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose"); // Assuming you choose MongoDB
const dotenv = require("dotenv");
const cron = require("node-cron");
const { resetLimit } = require("./utils");
const app = express();

dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Routes
const adminRoutes = require("./routes/admin"); // Replace with your actual routes path
const authRoutes = require("./routes/auth");
const randomDataRoutes = require("./routes/randomData");
const { default: axios } = require("axios");

// Use your routes
app.use("/admin", adminRoutes);
app.use("/user", authRoutes);
app.use(randomDataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Define the first job
cron.schedule("0 0 1 * *", async () => {
  try {
    await resetLimit();
  } catch (error) {
    console.error("Error running first job:", error);
  }
});

// Define the second job
cron.schedule("*/13 * * * *", async () => {
  try {
    const response = await axios.get("/v1/test");

    console.log(response.data);
  } catch (error) {
    console.error("Error running second job:", error);
  }
});

// Start server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
