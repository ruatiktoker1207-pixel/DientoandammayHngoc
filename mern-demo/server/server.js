const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend Node.js + Express is working!" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(
      "mongodb+srv://studentapi:Student123@cluster0.wdxbw8d.mongodb.net/cloud_lab?retryWrites=true&w=majority&appName=Cluster0",
      {
        serverSelectionTimeoutMS: 30000
      }
    );

    console.log("✅ Connected to MongoDB");
    console.log("Database:", mongoose.connection.name);
    console.log("State:", mongoose.connection.readyState);

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();