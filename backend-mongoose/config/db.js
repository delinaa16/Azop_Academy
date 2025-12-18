const mongoose = require("mongoose");

let isConnected = false;
let isConnecting = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.warn("Missing MONGO_URL. Create backend-mongoose/.env (see backend-mongoose/env.example.txt).");
    return false;
  }

  if (isConnecting) return isConnected;
  isConnecting = true;

  mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log("MongoDB Connected Successfully");
  });
  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("MongoDB disconnected");
  });
  mongoose.connection.on("error", (err) => {
    isConnected = false;
    console.error("MongoDB error:", err.message);
  });

  // Keep retrying so the app can start even if MongoDB isn't running yet.
  // This is especially helpful on Windows dev setups.
  while (!isConnected) {
    try {
      if (mongoose.connection.readyState === 1) {
        isConnected = true;
        break;
      }

      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 3000,
      });
      isConnected = true;
      break;
    } catch (error) {
      isConnected = false;
      console.warn(`MongoDB connection failed (${error.code || "unknown"}). Retrying in 5s...`);
      await sleep(5000);
    }
  }

  isConnecting = false;
  return isConnected;
};

connectDB.isConnected = () => isConnected;

module.exports = connectDB;
