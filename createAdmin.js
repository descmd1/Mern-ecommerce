// createAdmin.js in root

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./backend/models/user.model.js"; // use the correct relative path

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Log to check MONGO_URI is loading
console.log("MONGO_URI is:", process.env.MONGO_URI);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
    } else {
      const admin = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123", // use a strong password!
        role: "admin",
      });
      console.log("Admin created successfully:", admin);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
